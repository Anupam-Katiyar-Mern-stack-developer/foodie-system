import { getRestaurantOrdersService } from "../../services/order.service.js";

export const getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const page = Math.max(Number.parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit) || 10, 1),
      50,
    );

    const status = req.query.status
      ? req.query.status.trim().toUpperCase()
      : null;

    const result = await getRestaurantOrdersService({
      restaurantId,
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,

      message: "Restaurant orders fetched successfully",

      data: result.orders,

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
