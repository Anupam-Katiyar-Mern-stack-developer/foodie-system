import { resetPasswordService } from "../../services/passwordReset.service.js";

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const result = await resetPasswordService({
      token,
      password,
      confirmPassword,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to reset password",
    });
  }
};