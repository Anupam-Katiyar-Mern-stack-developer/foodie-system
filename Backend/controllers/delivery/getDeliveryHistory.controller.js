import { getDeliveryHistoryService } from "../../services/delivery.service.js";

export const getDeliveryHistory = async (req, res, next) => {
  try {
    const deliveryAgentId =
      req.deliveryAgent?.deliveryAgentId || req.deliveryAgentId || req.user?.id;

    if (!deliveryAgentId) {
      const error = new Error("Delivery agent authentication required");
      error.statusCode = 401;
      throw error;
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const data = await getDeliveryHistoryService({
      deliveryAgentId,
      page,
      limit,
      status: req.query.status || undefined,
      search: req.query.search || "",
    });

    return res.status(200).json({
      success: true,
      message: "Delivery history fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
