import { success } from "zod";
import { updateRestaurantProfileService } from "../../services/restaurant.service.js";

export const updateRestaurantProfile = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const restaurant = await updateRestaurantProfileService({
      restaurantId,
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant profile updated successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
