import { getRestaurantsService } from "../../services/restaurant.service.js";

export const getRestaurants = async (req, res, next) => {
  try {
    const result = await getRestaurantsService(req.query);

    return res.status(200).json({
      success: true,

      message: "Restaurants fetched successfully",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
