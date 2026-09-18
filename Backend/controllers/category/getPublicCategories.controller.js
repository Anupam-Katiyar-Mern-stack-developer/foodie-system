import { success } from "zod";
import { getPublicCategoriesService } from "../../services/category.service.js";

export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await getPublicCategoriesService();
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
