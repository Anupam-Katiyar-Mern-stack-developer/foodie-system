import { updateCartItemService } from "../../services/cart.service.js";

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { foodSlug } = req.params;

    const { quantity } = req.body;

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 20",
      });
    }

    const item = await updateCartItemService({
      userId,
      foodSlug,
      quantity: parsedQuantity,
    });

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};
