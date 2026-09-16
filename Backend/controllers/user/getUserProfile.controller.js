import { success } from "zod";
import { getUserProfileService } from "../../services/user.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const user = await getUserProfileService(userId);

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
