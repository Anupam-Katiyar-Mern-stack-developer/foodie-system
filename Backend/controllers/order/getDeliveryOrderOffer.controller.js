import { getDeliveryOrderOfferService } from "../../services/delivery.service.js";

export const getDeliveryOrderOffer = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const offer = await getDeliveryOrderOfferService({
      deliveryAgentId,
    });

    return res.status(200).json({
      success: true,

      message: offer
        ? "Delivery order offer fetched successfully"
        : "No active delivery offer",

      data: offer,
    });
  } catch (error) {
    next(error);
  }
};
