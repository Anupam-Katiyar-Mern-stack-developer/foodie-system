import { markOrderOutForDeliveryService } from "../../services/delivery.service.js";

export const markOrderOutForDelivery = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const order = await markOrderOutForDeliveryService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order is out for delivery",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
