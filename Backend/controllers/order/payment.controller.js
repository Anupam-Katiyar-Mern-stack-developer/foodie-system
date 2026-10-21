import {
  paymentConfigured,
  createPaymentService,
  verifyPaymentService,
  processPaymentWebhook,
  reconcilePaymentService,
} from "../../services/payment.service.js";
import pool from "../../config/database.js";
import { getCheckoutQuoteService } from "../../services/setting.service.js";
export const getCheckoutQuote = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await getCheckoutQuoteService(
        req.auth.userId,
        req.query.couponCode
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentConfig = (req, res) =>
  res.json({
    success: true,
    data: {
      configured: paymentConfigured(),
      mode: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_")
        ? "live"
        : "test",
    },
  });
export const createPayment = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await createPaymentService(
        req.auth.userId,
        req.body.checkoutNumber
      ),
    });
  } catch (error) {
    next(error);
  }
};
export const verifyPayment = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await verifyPaymentService(req.auth.userId, req.body),
    });
  } catch (error) {
    next(error);
  }
};
export const reconcilePayment = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await reconcilePaymentService(
        req.auth.userId,
        req.body.checkoutNumber
      ),
    });
  } catch (error) {
    next(error);
  }
};
export const paymentWebhook = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await processPaymentWebhook(
        req.body,
        req.headers["x-razorpay-signature"],
        req.headers["x-razorpay-event-id"]
      ),
    });
  } catch (error) {
    next(error);
  }
};
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT og.checkout_number AS "checkoutNumber",og.payment_status AS "paymentStatus",og.payment_method AS "paymentMethod",og.grand_total AS "grandTotal",(p.razorpay_order_id IS NOT NULL) AS "paymentStarted" FROM order_groups og LEFT JOIN payments p ON p.order_group_id=og.id WHERE og.user_id=$1 AND og.checkout_number=$2`,
      [req.auth.userId, req.params.checkoutNumber]
    );
    if (!rows[0])
      return res
        .status(404)
        .json({ success: false, message: "Checkout not found" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};
