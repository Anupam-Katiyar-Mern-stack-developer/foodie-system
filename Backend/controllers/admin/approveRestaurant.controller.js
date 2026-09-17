import { success } from "zod";
import { approveRestaurantService } from "../../services/admin.service.js";

export const approveRestaurant = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;

    const { restaurantSlug } = req.params;

    const restaurant = await approveRestaurantService({
      adminId,
      restaurantSlug,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant approved successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
