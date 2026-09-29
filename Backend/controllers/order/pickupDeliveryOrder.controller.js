import { pickupDeliveryOrderService } from "../../services/delivery.service.js";

export const pickupDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const order = await pickupDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order picked up successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
