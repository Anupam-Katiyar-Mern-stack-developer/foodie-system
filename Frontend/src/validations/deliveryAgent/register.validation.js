import { z } from "zod";

export const deliveryRegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit phone number"),

    address: z
      .string()
      .trim()
      .min(1, "Address is required")
      .min(5, "Enter a valid address"),

    vehicleType: z.enum(["BIKE", "SCOOTER", "BICYCLE"], {
      message: "Select a valid vehicle type",
    }),

    vehicleNumber: z.string().trim().optional(),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.vehicleType !== "BICYCLE" && !data.vehicleNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["vehicleNumber"],
        message: "Vehicle number is required",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });