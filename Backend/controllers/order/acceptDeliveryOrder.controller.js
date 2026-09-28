import { acceptDeliveryOrderService } from "../../services/delivery.service.js";

export const acceptDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const order = await acceptDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Delivery order accepted successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
