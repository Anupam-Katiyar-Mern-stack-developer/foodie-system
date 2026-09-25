import { getCartService } from "../../services/cart.service.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await getCartService({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
