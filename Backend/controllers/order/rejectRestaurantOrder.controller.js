import { rejectRestaurantOrderService } from "../../services/order.service.js";
import { emitOrderStatusUpdate } from "../../socket/order.socket.js";
export const rejectRestaurantOrder = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const order = await rejectRestaurantOrderService({
      restaurantId,
      orderNumber,
      reason: reason.trim(),
    });
    try {
      emitOrderStatusUpdate({
        orderNumber: order.orderNumber,
        status: order.status,
      });
    } catch (error) {
      console.error("Order status socket error:", error.message);
    }

    return res.status(200).json({
      success: true,

      message: "Order rejected successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
