import { success } from "zod";
import { createFoodService } from "../../services/food.service.js";

export const createFood = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const {
      name,
      categorySlug,
      description,
      price,
      discountPrice,
      isVeg,
      preparationTime,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    if (!categorySlug || !categorySlug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Food category is required",
      });
    }

    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid food price is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    const food = await createFoodService({
      restaurantId,

      name,
      categorySlug,
      description,

      price,
      discountPrice,

      isVeg,
      preparationTime,

      imageFile: req.file,

      imageFolder: req.uploadFolder,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};
