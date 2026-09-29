import { getActiveDeliveryOrderService } from "../../services/delivery.service.js";

export const getActiveDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const order = await getActiveDeliveryOrderService({
      deliveryAgentId,
    });

    return res.status(200).json({
      success: true,

      message: order
        ? "Active delivery order fetched successfully"
        : "No active delivery order",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
