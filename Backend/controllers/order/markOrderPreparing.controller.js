import { markOrderPreparingService } from "../../services/order.service.js";

export const markOrderPreparing = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const order = await markOrderPreparingService({
      restaurantId,
      orderNumber,
    });

    return res.status(200).json({
      success: true,

      message: "Order preparation started",

      data: order,
    });
  } catch (error) {
    next(error);
  }
};
