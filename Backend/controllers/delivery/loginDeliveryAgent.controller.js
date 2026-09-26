import { loginDeliveryAgentService } from "../../services/delivery.service.js";

export const loginDeliveryAgent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
     console.log("controller in delivery agent",email,password);
     
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const result = await loginDeliveryAgentService({
      email,
      password,
    });

    return res.status(200).json({
      success: true,

      message: "Delivery agent login successful",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
