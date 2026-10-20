import { acceptRestaurantOrderService } from "../../services/order.service.js";
import { emitOrderStatusUpdate } from "../../socket/order.socket.js";

export const acceptRestaurantOrder = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await acceptRestaurantOrderService({
      restaurantId,
      orderNumber,
    });

    try {
      emitOrderStatusUpdate({
        orderNumber: order.orderNumber,
        status: order.status,
        data: {
          confirmedAt: order.confirmedAt,
        },
      });
    } catch (socketError) {
      // The order is already accepted in the database.
      console.error("Order status socket error:", socketError.message);
    }

    return res.status(200).json({
      success: true,

      message: "Order accepted successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
