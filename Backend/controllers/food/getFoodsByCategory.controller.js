import { getFoodsByCategoryService } from "../../services/food.service.js";

export const getFoodsByCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;

    const page = Math.max(Number.parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit) || 12, 1),
      50,
    );

    const result = await getFoodsByCategoryService({
      categorySlug,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Category foods fetched successfully",

      data: {
        category: result.category,

        foods: result.foods,
      },

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
