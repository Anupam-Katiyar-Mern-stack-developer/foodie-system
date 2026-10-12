import { acceptDeliveryOrderService } from "../../services/delivery.service.js";

export const acceptDeliveryOrder = async (req, res) => {
  try {
    const { deliveryAgentId } = req.deliveryAgent;
    const { orderNumber } = req.params;

    const data = await acceptDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery order accepted successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to accept delivery order",
    });
  }
};
