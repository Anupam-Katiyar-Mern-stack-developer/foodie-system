import { rejectDeliveryOrderService } from "../../services/delivery.service.js";
import { emitDeliveryOfferResponse } from "../../socket/order.socket.js";

export const rejectDeliveryOrder = async (req, res) => {
  try {
    const { deliveryAgentId } = req.deliveryAgent;
    const { orderNumber } = req.params;

    const result = await rejectDeliveryOrderService({
      deliveryAgentId,
      orderNumber,
    });

    const { offerResponse, ...publicResult } = result;

    try {
      emitDeliveryOfferResponse(offerResponse);
    } catch (socketError) {
      console.error(
        "Delivery rejected response socket error:",
        socketError.message,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Delivery offer rejected successfully",
      data: publicResult,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to reject delivery offer",
    });
  }
};
