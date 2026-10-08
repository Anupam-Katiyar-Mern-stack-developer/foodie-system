import { getRestaurantDashboardService } from "../../services/restaurant.service.js";

export const getRestaurantDashboardController = async (req, res, next) => {
  try {
    /*
     * IMPORTANT:
     *
     * Yahan wahi restaurantId
     * use karna jo tumhara existing
     * restaurant auth middleware
     * request me attach karta hai.
     *
     * Agar existing order controller
     * me req.restaurant.id hai,
     * ye correct hai.
     */

    const restaurantId = req.restaurant.restaurantId;

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
