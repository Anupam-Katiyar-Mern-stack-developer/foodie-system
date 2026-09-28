import { rejectDeliveryOrderService } from "../../services/delivery.service.js";

export const rejectDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    const result = await rejectDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Delivery order rejected successfully",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
