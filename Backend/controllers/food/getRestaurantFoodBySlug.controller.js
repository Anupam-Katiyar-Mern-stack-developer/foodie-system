import { getRestaurantFoodBySlugService } from "../../services/food.service.js";

export const getRestaurantFoodBySlug = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { foodSlug } = req.params;

    const food = await getRestaurantFoodBySlugService({
      restaurantId,
      foodSlug,
    });

    return res.status(200).json({
      success: true,
      message: "Food fetched successfully",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};
