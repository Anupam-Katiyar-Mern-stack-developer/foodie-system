import {
  getDeliveryDashboardService,
  getDeliveryEarningsService,
} from "../../services/delivery.service.js";

export const getDeliveryDashboard = async (req, res, next) => {
  try {
    const deliveryAgentId =
      req.deliveryAgent?.deliveryAgentId || req.deliveryAgentId || req.user?.id;

    console.log(deliveryAgentId);
    if (!deliveryAgentId) {
      const error = new Error("Delivery agent authentication required");
      error.statusCode = 401;
      throw error;
    }

    const dashboard = await getDeliveryDashboardService({
      deliveryAgentId,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryEarnings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await getDeliveryEarningsService({
        ...req.query,
        deliveryAgentId: req.deliveryAgent.deliveryAgentId,
      }),
    });
  } catch (error) {
    next(error);
  }
};
