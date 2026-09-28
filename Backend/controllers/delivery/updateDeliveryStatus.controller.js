import { updateDeliveryStatusService } from "../../services/delivery.service.js";

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isOnline must be true or false",
      });
    }

    const result = await updateDeliveryStatusService({
      deliveryAgentId,
      isOnline,
    });

    return res.status(200).json({
      success: true,

      message: isOnline ? "You are now online" : "You are now offline",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
