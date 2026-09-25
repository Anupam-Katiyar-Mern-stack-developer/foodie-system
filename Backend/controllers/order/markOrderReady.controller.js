import { markOrderReadyService } from "../../services/order.service.js";

export const markOrderReady = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await markOrderReadyService({
      restaurantId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order is ready for pickup",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
