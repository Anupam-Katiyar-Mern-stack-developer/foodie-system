import { getUserOrderByNumberService } from "../../services/order.service.js";

export const getUserOrderByNumber = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { orderNumber } = req.params;

    const order = await getUserOrderByNumberService({
      userId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order fetched successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
