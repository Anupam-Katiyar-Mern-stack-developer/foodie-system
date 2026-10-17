import { placeOrderService } from "../../services/order.service.js";

import { emitNewRestaurantOrder } from "../../socket/order.socket.js";

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const { addressId, paymentMethod = "COD" } = req.body;

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
    // Abhi sirf COD enabled hai.
    //
    // Future Online Payment Module:
    //
    // paymentMethod = "ONLINE"
    //        ↓
    // Razorpay / Payment Gateway
    //        ↓
    // Payment Order Create
    //        ↓
    // Payment Verify
    //        ↓
    // payment_status = PAID
    //        ↓
    // Order placement continue
    //
    // Online payment module add karne ke
    // time allowedPaymentMethods me ONLINE
    // add karenge.
    // =========================================

    const allowedPaymentMethods = ["COD"];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Only COD is currently available",
      });
    }

    // =========================================
    // CREATE ORDER
    // =========================================

    const result = await placeOrderService({
      userId,
      addressId,
      paymentMethod,
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

    for (const order of result.orders || []) {
      try {
        const { restaurantId, ...publicOrder } = order;

        if (!restaurantId) {
          console.error(
            "Restaurant socket skipped: restaurantId missing",
            order.orderNumber,
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
      ({ restaurantId, ...order }) => order,
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
