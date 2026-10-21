import { z } from "zod";
import { registerDeliveryAgentService } from "../../services/delivery.service.js";

export const registerDeliveryAgent = async (req, res, next) => {
  try {
    const parsed = z
      .object({
        name: z.string().trim().min(2),
        email: z.string().trim().email(),
        phone: z
          .string()
          .trim()
          .regex(/^[0-9]{10}$/),
        password: z.string().min(8),
        vehicleType: z.enum(["BIKE", "SCOOTER", "BICYCLE"]),
        vehicleNumber: z.string().trim().nullish(),
        address: z.string().trim().max(1000).optional(),
      })
      .refine(
        (value) =>
          value.vehicleType === "BICYCLE" || Boolean(value.vehicleNumber),
        { message: "Vehicle number is required" }
      )
      .safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
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
    } = parsed.data;

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

    if (
      vehicleType !== "BICYCLE" &&
      (!vehicleNumber || !vehicleNumber.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number is required",
      });
    }

    if (!["BIKE", "SCOOTER", "BICYCLE"].includes(vehicleType)) {
      return res
        .status(400)
        .json({ success: false, message: "Select a valid vehicle type" });
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
