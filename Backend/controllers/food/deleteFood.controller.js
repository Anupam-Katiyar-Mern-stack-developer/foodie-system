import {
  deleteFoodService,
} from "../../services/food.service.js";

export const deleteFood = async (
  req,
  res,
  next
) => {
  try {
    const restaurantId =
      req.restaurant.restaurantId;

    const { foodSlug } = req.params;

    const food =
      await deleteFoodService({
        restaurantId,
        foodSlug,
      });

    return res.status(200).json({
      success: true,
      message:
        "Food deleted successfully",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};