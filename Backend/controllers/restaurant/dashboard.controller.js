import { getRestaurantDashboardService } from "../../services/restaurant.service.js";

export const getRestaurantDashboardController = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.id;

    const dashboard = await getRestaurantDashboardService({
      restaurantId,
    });

    return res.status(200).json({
      success: true,

      message: "Restaurant dashboard fetched successfully",

      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
