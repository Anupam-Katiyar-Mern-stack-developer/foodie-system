import { getUserOrdersService } from "../../services/order.service.js";

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const page = Math.max(Number.parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit) || 10, 1),
      50,
    );

    const result = await getUserOrdersService({
      userId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,

      message: "Orders fetched successfully",

      data: result.orders,

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
