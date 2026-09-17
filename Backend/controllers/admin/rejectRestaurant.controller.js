import { rejectRestaurantService } from "../../services/admin.service.js";

export const rejectRestaurant = async (
  req,
  res,
  next
) => {
  try {
    const adminId = req.admin.adminId;

    const { restaurantSlug } = req.params;

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const restaurant =
      await rejectRestaurantService({
        adminId,
        restaurantSlug,
        reason,
      });

    return res.status(200).json({
      success: true,
      message: "Restaurant rejected successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};