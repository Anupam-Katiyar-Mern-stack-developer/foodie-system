import { getRestaurantOrderByNumberService } from "../../services/order.service.js";

export const getRestaurantOrderByNumber = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await getRestaurantOrderByNumberService({
      restaurantId,
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
