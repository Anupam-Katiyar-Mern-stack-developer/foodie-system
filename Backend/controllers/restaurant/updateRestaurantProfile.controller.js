import { success } from "zod";
import { updateRestaurantProfileService } from "../../services/restaurant.service.js";

export const updateRestaurantProfile = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const {
      ownerName,
      restaurantName,
      phone,
      description,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,
      openingTime,
      closingTime,
    } = req.body;

    const profile = await updateRestaurantProfileService({
      restaurantId,

      ownerName,
      restaurantName,
      phone,
      description,

      addressLine,
      city,
      state,
      pincode,

      latitude,
      longitude,

      openingTime,
      closingTime,

      logoFile: req.file || null,
      logoFolder: req.uploadFolder,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
