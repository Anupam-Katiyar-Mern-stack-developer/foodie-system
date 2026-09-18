import { getRestaurantProfileService } from "../../services/restaurant.service.js";

export const getRestaurantProfile = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;
    

    const restaurant = await getRestaurantProfileService({restaurantId});

    return res.status(200).json({
      success: true,
      message: "Restaurant profile fetched successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
