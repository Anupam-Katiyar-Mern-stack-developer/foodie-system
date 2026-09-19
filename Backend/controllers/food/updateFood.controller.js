import {
  updateFoodService,
} from "../../services/food.service.js";

export const updateFood = async (
  req,
  res,
  next
) => {
  try {
    const restaurantId =
      req.restaurant.restaurantId;

    const { foodSlug } = req.params;

    const {
      name,
      categorySlug,
      description,
      price,
      discountPrice,
      isVeg,
      isAvailable,
      preparationTime,
    } = req.body;

    const food =
      await updateFoodService({
        restaurantId,
        foodSlug,

        name,
        categorySlug,
        description,

        price,
        discountPrice,

        isVeg,
        isAvailable,
        preparationTime,

        imageFile:
          req.file || null,

        imageFolder:
          req.uploadFolder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Food updated successfully",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};