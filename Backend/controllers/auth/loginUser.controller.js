import { success } from "zod";
import { loginUserService } from "../../services/auth.service.js";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUserService({
      email,
      password,
    });

    return res.status(200).json({
      success: "Login successfully",
      data: result,
    });
    
  } catch (error) {
    next(error);
  }
};
