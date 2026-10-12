import { getDeliveryOrderOfferService } from "../../services/delivery.service.js";

export const getDeliveryOrderOffer = async (req, res) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const data = await getDeliveryOrderOfferService({
      deliveryAgentId,
    });
    console.log(data);

    return res.status(200).json({
      success: true,
      message: data
        ? "Delivery offer fetched successfully"
        : "No active delivery offer found",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch delivery offer",
    });
  }
};
