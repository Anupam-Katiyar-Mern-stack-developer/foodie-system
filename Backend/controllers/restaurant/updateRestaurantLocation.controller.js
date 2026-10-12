import { updateRestaurantLocationService } from "../../services/restaurant.service.js";

export const updateRestaurantLocation = async (req, res) => {
  try {
    const restaurantId = req.restaurant.restaurantId;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const data = await updateRestaurantLocationService({
      restaurantId,
      latitude,
      longitude,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant location updated successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update restaurant location",
    });
    
  }
};
