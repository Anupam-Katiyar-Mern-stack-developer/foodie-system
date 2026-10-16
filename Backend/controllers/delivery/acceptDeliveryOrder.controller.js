import { acceptDeliveryOrderService } from "../../services/delivery.service.js";
// accept delivery order controller file me import add karo
import { emitDeliveryAssigned } from "../../socket/order.socket.js";

export const acceptDeliveryOrder = async (req, res) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: "Order number is required",
      });
    }

    const result = await acceptDeliveryOrderService({
      deliveryAgentId: req.deliveryAgent.deliveryAgentId,
      orderNumber: req.params.orderNumber,
    });

    emitDeliveryAssigned({
      orderNumber: result.orderNumber,
      deliveryAgent: result.deliveryAgent,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery offer accepted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to accept delivery order",
    });
  }
};
