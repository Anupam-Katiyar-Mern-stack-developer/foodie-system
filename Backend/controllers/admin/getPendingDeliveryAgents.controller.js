import { getPendingDeliveryAgentsService } from "../../services/delivery.service.js";

export const getPendingDeliveryAgents = async (req, res, next) => {
  try {
    const agents = await getPendingDeliveryAgentsService();

    return res.status(200).json({
      success: true,
      message: "Pending delivery agents fetched successfully",
      data: agents,
    });
  } catch (error) {
    next(error);
  }
};
