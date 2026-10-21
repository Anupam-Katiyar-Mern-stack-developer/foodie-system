import { pickupDeliveryOrderService } from "../../services/delivery.service.js";
import { emitOrderStatusUpdate } from "../../socket/order.socket.js";

export const pickupDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const order = await pickupDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    try {
      emitOrderStatusUpdate({
        orderNumber: order.orderNumber,
        status: order.status,
      });
    } catch (socketError) {
      console.error("Delivery status socket error:", socketError.message);
    }

    return res.status(200).json({
      success: true,

      message: "Order picked up successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
