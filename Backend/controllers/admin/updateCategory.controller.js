import { success } from "zod";
import { updateCategoryService } from "../../services/category.service.js";

export const updateCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;

    const { name, description, displayOrder } = req.body;

    const category = await updateCategoryService({
      categorySlug,
      name,
      description,
      displayOrder,
      imageFile: req.file || null,
      imageFolder: req.uploadFolder,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
