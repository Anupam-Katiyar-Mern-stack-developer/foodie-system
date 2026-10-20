import { completeDeliveryOrderService } from "../../services/delivery.service.js";
import { emitOrderStatusUpdate } from "../../socket/order.socket.js";

export const completeDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const { otp } = req.body;

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit delivery OTP is required",
      });
    }

    const order = await completeDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
      otp: String(otp),
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

      message: "Order delivered successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
