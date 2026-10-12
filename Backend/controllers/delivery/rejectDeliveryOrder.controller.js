import { rejectDeliveryOrderService } from "../../services/delivery.service.js";

export const rejectDeliveryOrder = async (req, res) => {
  try {
    const { deliveryAgentId } = req.deliveryAgent;
    const { orderNumber } = req.params;

    const data = await rejectDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery offer rejected successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to reject delivery offer",
    });
  }
};
