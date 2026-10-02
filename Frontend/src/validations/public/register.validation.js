import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10 digit mobile number"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });
