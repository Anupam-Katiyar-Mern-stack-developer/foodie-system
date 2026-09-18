import { success } from "zod";
import { getAdminCategoriesService } from "../../services/category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAdminCategoriesService();

    return res.status(200).json({
      success: true,
      message: "Admin categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
