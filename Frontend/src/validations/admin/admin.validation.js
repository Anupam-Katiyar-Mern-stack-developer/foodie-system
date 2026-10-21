import { z } from "zod";

export const adminLoginSchema = z.object({ email: z.string().trim().email("Enter a valid email"), password: z.string().min(1, "Password is required") });
export const adminCategorySchema = (editing) => z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  displayOrder: z.coerce.number().int().min(0),
  image: z.any().refine((value) => editing || value instanceof File, "Choose a category image"),
});
export const adminProfileSchema = z.object({
  name: z.string().trim().min(2).max(100), email: z.string().trim().email(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.union([z.literal(""), z.string().min(8).max(72)]),
});
