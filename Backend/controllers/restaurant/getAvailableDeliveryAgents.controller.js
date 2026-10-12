import { getAvailableDeliveryAgentsForOrderService } from "../../services/delivery.service.js";

export const getAvailableDeliveryAgents = async (req, res) => {
  try {
    const restaurantId = req.restaurant.restaurantId;
    const { orderNumber } = req.params;
    const { radiusKm } = req.query;

    const data = await getAvailableDeliveryAgentsForOrderService({
      restaurantId,
      orderNumber,
      radiusKm,
    });

    return res.status(200).json({
      success: true,
      message: "Available delivery partners fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch delivery partners",
    });
  }
};
