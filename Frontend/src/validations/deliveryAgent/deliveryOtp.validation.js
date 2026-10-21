import { z } from "zod";

export const deliveryOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "Delivery OTP is required")
    .regex(/^\d{6}$/, "Enter a valid 6-digit OTP"),
});
