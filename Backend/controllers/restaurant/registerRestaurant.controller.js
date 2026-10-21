import { z } from "zod";
import { registerRestaurantService } from "../../services/restaurant.service.js";

export const registerRestaurant = async (req, res, next) => {
  try {
    const coordinate = (min, max) =>
      z.preprocess(
        (value) => (value === "" || value == null ? undefined : Number(value)),
        z.number().finite().min(min).max(max).optional()
      );
    const parsed = z
      .object({
        ownerName: z.string().trim().min(2),
        restaurantName: z.string().trim().min(2),
        email: z.string().trim().email(),
        phone: z
          .string()
          .trim()
          .regex(/^[0-9]{10}$/),
        password: z.string().min(8),
        description: z.string().trim().max(1000).optional(),
        addressLine: z.string().trim().min(5),
        city: z.string().trim().min(2),
        state: z.string().trim().min(2),
        pincode: z
          .string()
          .trim()
          .regex(/^[0-9]{6}$/),
        latitude: coordinate(-90, 90),
        longitude: coordinate(-180, 180),
      })
      .refine(
        (value) =>
          (value.latitude === undefined) === (value.longitude === undefined),
        { message: "Provide both latitude and longitude" }
      )
      .safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    const {
      ownerName,
      restaurantName,
      email,
      phone,
      password,
      description,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = parsed.data;

    if (
      !ownerName ||
      !restaurantName ||
      !email ||
      !phone ||
      !password ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required resturant fields are missing",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const restaurant = await registerRestaurantService({
      ownerName,
      restaurantName,
      email,
      phone,
      password,
      description,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message:
        "Restaurant registered successfully and waiting for admin approval",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
