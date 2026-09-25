import { rejectRestaurantOrderService } from "../../services/order.service.js";

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

    return res.status(200).json({
      success: true,

      message: "Order rejected successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
