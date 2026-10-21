import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPaymentConfig,
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getCheckoutQuote,
  reconcilePayment,
} from "../controllers/order/payment.controller.js";
const router = express.Router();
router.get("/config", getPaymentConfig);
router.get("/quote", authMiddleware, getCheckoutQuote);
router.post("/create", authMiddleware, createPayment);
router.post("/verify", authMiddleware, verifyPayment);
router.post("/reconcile", authMiddleware, reconcilePayment);
router.get("/:checkoutNumber/status", authMiddleware, getPaymentStatus);
export default router;
