import { placeOrderService } from "../../services/order.service.js";

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { addressId, paymentMethod = "COD" } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (!["COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Only COD is currently available",
      });
    }

    const result = await placeOrderService({
      userId,
      addressId,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
