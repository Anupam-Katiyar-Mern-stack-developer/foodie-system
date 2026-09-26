import { rejectDeliveryAgentService } from "../../services/delivery.service.js";

export const rejectDeliveryAgent = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const agent = await rejectDeliveryAgentService({
      publicId,
      reason: reason.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Delivery agent rejected successfully",
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};
