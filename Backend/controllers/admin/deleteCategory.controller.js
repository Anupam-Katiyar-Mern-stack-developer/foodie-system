import { deleteCategoryService } from "../../services/category.service.js";

export const deleteCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;

    const category = await deleteCategoryService({
      categorySlug,
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
