import { createCategoryService } from "../../services/category.service.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, displayOrder } = req.body;

    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const category = await createCategoryService({
      name,
      description,
      displayOrder,

      imageFile: req.file,

      imageFolder: req.uploadFolder,
    });

    return res.status(201).json({
      success: true,

      message: "Category created successfully",

      data: category,
    });
  } catch (error) {
    next(error);
  }
};
