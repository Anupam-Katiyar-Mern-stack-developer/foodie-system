import { removeCartItemService } from "../../services/cart.service.js";

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { foodSlug } = req.params;

    const result = await removeCartItemService({
      userId,
      foodSlug,
    });

    return res.status(200).json({
      success: true,
      message: "Food removed from cart successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
