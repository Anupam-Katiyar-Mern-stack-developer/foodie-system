import { getAvailableDeliveryAgentsForOrderService } from "../../services/delivery.service.js";

export const getAvailableDeliveryAgents = async (req, res) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const data = await getAvailableDeliveryAgentsForOrderService({
      restaurantId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Available delivery partners fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch available delivery partners",
    });
  }
};
