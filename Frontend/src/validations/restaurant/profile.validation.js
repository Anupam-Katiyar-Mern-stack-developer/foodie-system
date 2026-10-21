import { z } from "zod";

const optionalCoordinate = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return Number(value);
  },

  z
    .number({
      invalid_type_error: "Enter a valid coordinate",
    })
    .optional(),
);

export const restaurantProfileSchema = z.object({
  ownerName: z
    .string()
    .trim()
    .min(2, "Owner name must be at least 2 characters")
    .max(100, "Owner name is too long"),

  restaurantName: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(120, "Restaurant name is too long"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),

  addressLine: z
    .string()
    .trim()
    .min(5, "Enter complete restaurant address")
    .max(250, "Address is too long"),

  city: z.string().trim().min(2, "City is required"),

  state: z.string().trim().min(2, "State is required"),

  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter a valid 6 digit pincode"),

  latitude: optionalCoordinate,

  longitude: optionalCoordinate,

  logo: z.any().optional().nullable(),
});
