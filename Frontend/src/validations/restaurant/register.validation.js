import { z } from "zod";

const optionalCoordinate = (min, max) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return Number(value);
  }, z.number().finite().min(min, `Must be at least ${min}`).max(max, `Must be at most ${max}`).optional());

export const restaurantRegisterSchema = z
  .object({
    ownerName: z
      .string()
      .trim()
      .min(2, "Owner name must be at least 2 characters"),

    restaurantName: z
      .string()
      .trim()
      .min(2, "Restaurant name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm your password"),

    description: z
      .string()
      .trim()
      .max(1000, "Description is too long")
      .optional(),

    addressLine: z
      .string()
      .trim()
      .min(5, "Enter a complete restaurant address"),

    city: z.string().trim().min(2, "City is required"),

    state: z.string().trim().min(2, "State is required"),

    pincode: z
      .string()
      .trim()
      .regex(/^[0-9]{6}$/, "Enter a valid 6 digit pincode"),

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
