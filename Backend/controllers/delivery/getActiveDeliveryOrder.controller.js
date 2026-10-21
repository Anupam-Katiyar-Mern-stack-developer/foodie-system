import { getActiveDeliveryOrderService } from "../../services/delivery.service.js";

export const getActiveDeliveryOrder = async (req, res) => {
  try {
    const { deliveryAgentId } = req.deliveryAgent;
    const { orderNumber } = req.params;

    const data = await getActiveDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,
      message: data
        ? "Active delivery fetched successfully"
        : "No active delivery",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch active delivery",
    });
  }
};
