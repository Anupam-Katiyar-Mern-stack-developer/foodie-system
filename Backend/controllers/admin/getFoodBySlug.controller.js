import {
  getAdminFoodBySlugService,
} from "../../services/food.service.js";

export const getFoodBySlug = async (
  req,
  res,
  next
) => {
  try {
    const { foodSlug } =
      req.params;

    const food =
      await getAdminFoodBySlugService({
        foodSlug,
      });

    return res.status(200).json({
      success: true,
      message:
        "Food fetched successfully",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};