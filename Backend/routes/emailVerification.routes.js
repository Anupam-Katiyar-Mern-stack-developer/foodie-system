import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";
import { deliveryAuthMiddleware } from "../middleware/deliveryAuth.middleware.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.middleware.js";
import {
  getEmailVerificationStatus,
  sendEmailVerification,
  verifyEmailCode,
} from "../services/emailVerification.service.js";

export const emailVerificationRoutes = (kind) => {
  const router = Router();
  const auth = {
    user: authMiddleware,
    restaurant: restaurantAuthMiddleware,
    delivery: deliveryAuthMiddleware,
    admin: adminAuthMiddleware,
  }[kind];
  router.use(auth);
  router.use((req, res, next) => {
    const identity = {
      user: [req.auth?.role, req.auth?.userId],
      restaurant: [req.restaurant?.role, req.restaurant?.restaurantId],
      delivery: [req.deliveryAgent?.role, req.deliveryAgent?.deliveryAgentId],
      admin: [req.admin?.role, req.admin?.adminId],
    }[kind];
    const role = {
      user: "user",
      restaurant: "restaurant",
      delivery: "deliveryAgent",
      admin: "SUPER_ADMIN",
    }[kind];
    if (identity?.[0] !== role || !identity[1])
      return res.status(403).json({
        success: false,
        message: "This account cannot access this verification route",
      });
    req.verificationAccountId = identity[1];
    next();
  });
  const handle = (operation) => async (req, res, next) => {
    try {
      res
        .set("Cache-Control", "no-store")
        .json({ success: true, data: await operation(req) });
    } catch (error) {
      if (error.retryAfter) res.set("Retry-After", String(error.retryAfter));
      next(error);
    }
  };
  router.get(
    "/",
    handle((req) => getEmailVerificationStatus(kind, req.verificationAccountId))
  );
  router.post(
    "/send",
    handle((req) => sendEmailVerification(kind, req.verificationAccountId))
  );
  router.post(
    "/verify",
    handle((req) =>
      verifyEmailCode(kind, req.verificationAccountId, req.body.code)
    )
  );
  return router;
};
