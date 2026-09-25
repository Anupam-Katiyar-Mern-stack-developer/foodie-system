import {
  getPublicRestaurantBySlugService,
} from "../../services/restaurant.service.js";

export const getPublicRestaurant = async (
  req,
  res,
  next
) => {
  try {
    const { restaurantSlug } =
      req.params;

    const restaurant =
      await getPublicRestaurantBySlugService({
        restaurantSlug,
      });

    return res.status(200).json({
      success: true,
      message:
        "Restaurant fetched successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};