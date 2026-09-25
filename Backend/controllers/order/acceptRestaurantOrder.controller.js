import { acceptRestaurantOrderService } from "../../services/order.service.js";

export const acceptRestaurantOrder = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await acceptRestaurantOrderService({
      restaurantId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order accepted successfully",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
