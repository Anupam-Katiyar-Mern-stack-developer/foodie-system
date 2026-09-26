import { approveDeliveryAgentService } from "../../services/delivery.service.js";

export const approveDeliveryAgent = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    const agent = await approveDeliveryAgentService({
      publicId,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery agent approved successfully",
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};
