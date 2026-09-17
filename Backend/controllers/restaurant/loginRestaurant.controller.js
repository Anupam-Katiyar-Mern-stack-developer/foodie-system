import { success } from "zod";
import { loginRestaurantService } from "../../services/restaurant.service.js";

export const loginRestaurant = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required ",
      });
    }

    const result = await loginRestaurantService({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant login successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
