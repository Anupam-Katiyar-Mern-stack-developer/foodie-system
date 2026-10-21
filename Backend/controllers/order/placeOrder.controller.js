import { placeOrderService } from "../../services/order.service.js";

import { emitNewRestaurantOrder } from "../../socket/order.socket.js";
import { paymentConfigured } from "../../services/payment.service.js";

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const {
      addressId,
      paymentMethod = "COD",
      latitude,
      longitude,
      couponCode,
      requestKey,
      expectedTotal,
    } = req.body;
    if (
      requestKey &&
      (typeof requestKey !== "string" ||
        !/^[A-Za-z0-9_-]{8,100}$/.test(requestKey))
    )
      return res
        .status(400)
        .json({ success: false, message: "Invalid checkout request key" });

    // =========================================
    // DELIVERY ADDRESS
    // =========================================

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // =========================================
    // PAYMENT METHOD
    // =========================================
    //
    // COD is placed immediately; ONLINE is released only after capture verification.
    const allowedPaymentMethods = ["COD", "ONLINE"];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Select COD or ONLINE payment",
      });
    }

    // =========================================
    // CREATE ORDER
    // =========================================

    if (paymentMethod === "ONLINE" && !paymentConfigured())
      return res.status(503).json({
        success: false,
        message:
          "Online payment is not configured yet. Choose cash on delivery.",
      });
    const result = await placeOrderService({
      userId,
      addressId,
      paymentMethod,
      latitude,
      longitude,
      couponCode,
      requestKey,
      expectedTotal,
    });

    // =========================================
    // REALTIME NEW ORDER → RESTAURANT
    // =========================================
    //
    // placeOrderService COMMIT hone ke baad
    // result return karta hai.
    //
    // Isliye socket event sirf successful
    // DB order creation ke baad emit hoga.
    //
    // Multiple restaurants ho sakte hain,
    // isliye har restaurant ke room me
    // uska separate order jayega.
    // =========================================

    for (const order of result.paymentMethod === "COD" && !result.replayed
      ? result.orders || []
      : []) {
      try {
        const { restaurantId, ...publicOrder } = order;

        if (!restaurantId) {
          console.error(
            "Restaurant socket skipped: restaurantId missing",
            order.orderNumber
          );

          continue;
        }

        emitNewRestaurantOrder({
          restaurantId,

          order: {
            ...publicOrder,

            message: "You have received a new order",
          },
        });
      } catch (socketError) {
        // Socket fail hone par order fail
        // nahi karna because DB me order
        // already create ho chuka hai.
        console.error("New order socket error:", socketError.message);
      }
    }

    // =========================================
    // PUBLIC RESPONSE
    // =========================================
    //
    // Internal restaurantId user frontend
    // ko expose nahi karna.
    // =========================================

    const publicOrders = (result.orders || []).map(
      ({ restaurantId, ...order }) => order
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",

      data: {
        ...result,
        orders: publicOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
