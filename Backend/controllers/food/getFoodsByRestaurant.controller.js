import { getFoodsByRestaurantService } from "../../services/food.service.js";

export const getFoodsByRestaurant = async (req, res, next) => {
  try {
    const { restaurantSlug } = req.params;

    const page = Math.max(Number.parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit) || 20, 1),
      50,
    );

    const result = await getFoodsByRestaurantService({
      restaurantSlug,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,

      message: "Restaurant foods fetched successfully",

      data: {
        restaurant: result.restaurant,

        foods: result.foods,
      },

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
