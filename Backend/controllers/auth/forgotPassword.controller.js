import { forgotPasswordService } from "../../services/passwordReset.service.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email, accountType } = req.body;

    const result = await forgotPasswordService({
      email,
      accountType,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to process forgot password request",
    });
  }
};
