import { clearCartService } from "../../services/cart.service.js";

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await clearCartService({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
