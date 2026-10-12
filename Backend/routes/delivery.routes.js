import express from "express";

import { registerDeliveryAgent } from "../controllers/delivery/registerDeliveryAgent.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";
import { loginDeliveryAgent } from "../controllers/delivery/loginDeliveryAgent.controller.js";

import { deliveryAuthMiddleware } from "../middleware/deliveryAuth.middleware.js";
import { getDeliveryProfile } from "../controllers/delivery/getDeliveryProfile.controller.js";

import { updateDeliveryProfile } from "../controllers/delivery/updateDeliveryProfile.controller.js";

import { updateDeliveryStatus } from "../controllers/delivery/updateDeliveryStatus.controller.js";

import { updateDeliveryLocation } from "../controllers/delivery/updateDeliveryLocation.controller.js";
import { getDeliveryDashboard } from "../controllers/delivery/getDeliveryDashboard.controller.js";
import { getDeliveryHistory } from "../controllers/delivery/getDeliveryHistory.controller.js";
import { getDeliveryOrderOffer } from "../controllers/delivery/getDeliveryOrderOffer.controller.js";
import { acceptDeliveryOrder } from "../controllers/delivery/acceptDeliveryOrder.controller.js";
import { rejectDeliveryOrder } from "../controllers/delivery/rejectDeliveryOrder.controller.js";
import { getActiveDeliveryOrder } from "../controllers/delivery/getActiveDeliveryOrder.controller.js";

const router = express.Router();

router.get("/dashboard", deliveryAuthMiddleware, getDeliveryDashboard);

router.post(
  "/register",
  uploadImage("delivery-agents", "image"),

  registerDeliveryAgent,
);

router.post("/login", loginDeliveryAgent);

router.get("/profile", deliveryAuthMiddleware, getDeliveryProfile);

router.put(
  "/profile",

  deliveryAuthMiddleware,

  uploadImage("delivery-agents", "image"),

  updateDeliveryProfile,
);

router.patch("/online-status", deliveryAuthMiddleware, updateDeliveryStatus);

router.patch("/location", deliveryAuthMiddleware, updateDeliveryLocation);

router.get("/history", deliveryAuthMiddleware, getDeliveryHistory);

router.get("/orders/offers", deliveryAuthMiddleware, getDeliveryOrderOffer);

router.patch(
  "/orders/:orderNumber/accept",
  deliveryAuthMiddleware,
  acceptDeliveryOrder,
);

router.patch(
  "/orders/:orderNumber/reject",
  deliveryAuthMiddleware,
  rejectDeliveryOrder,
);

router.get("/orders/active", deliveryAuthMiddleware, getActiveDeliveryOrder);

export default router;
