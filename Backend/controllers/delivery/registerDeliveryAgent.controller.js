import { registerDeliveryAgentService } from "../../services/delivery.service.js";

export const registerDeliveryAgent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      vehicleType,
      vehicleNumber,
      address,
      latitude,
      longitude,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!vehicleType || !vehicleType.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vehicle type is required",
      });
    }

    if (!vehicleNumber || !vehicleNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number is required",
      });
    }

    const deliveryAgent = await registerDeliveryAgentService({
      name,
      email,
      phone,
      password,

      vehicleType,
      vehicleNumber,

      address,

      latitude,
      longitude,

      imageFile: req.file || null,

      imageFolder: req.uploadFolder,
    });

    return res.status(201).json({
      success: true,

      message:
        "Delivery agent registered successfully. Please wait for admin approval.",

      data: deliveryAgent,
    });
  } catch (error) {
    next(error);
  }
};
