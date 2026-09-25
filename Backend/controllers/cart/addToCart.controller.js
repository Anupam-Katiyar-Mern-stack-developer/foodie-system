import {
  addToCartService,
} from "../../services/cart.service.js";

export const addToCart = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user.userId;

    const {
      foodSlug,
      quantity = 1,
    } = req.body;

    if (
      !foodSlug ||
      !foodSlug.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Food is required",
      });
    }

    const parsedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be between 1 and 20",
      });
    }

    const result =
      await addToCartService({
        userId,
        foodSlug: foodSlug.trim(),
        quantity: parsedQuantity,
      });

    return res.status(200).json({
      success: true,
      message:
        "Food added to cart successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};