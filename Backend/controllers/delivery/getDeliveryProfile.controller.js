import { getDeliveryProfileService } from "../../services/delivery.service.js";

export const getDeliveryProfile = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const profile = await getDeliveryProfileService({
      deliveryAgentId,
    });

    return res.status(200).json({
      success: true,

      message: "Delivery agent profile fetched successfully",

      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
