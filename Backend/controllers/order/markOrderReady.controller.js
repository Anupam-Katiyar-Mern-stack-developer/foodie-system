import { markOrderReadyService } from "../../services/order.service.js";
import { emitOrderStatusUpdate } from "../../socket/order.socket.js";
export const markOrderReady = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await markOrderReadyService({
      restaurantId,
      orderNumber,
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

      message: "Order is ready for pickup",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
