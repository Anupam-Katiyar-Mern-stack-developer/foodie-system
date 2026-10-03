import { z } from "zod";

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Address type is required"),

  addressLine: z
    .string()
    .trim()
    .min(5, "Please enter a complete address")
    .max(250, "Address is too long"),

  landmark: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City is too long"),

  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(100, "State is too long"),

  pincode: z
    .string()
    .trim()
    .regex(
      /^[1-9][0-9]{5}$/,
      "Enter a valid 6 digit pincode"
    ),
});