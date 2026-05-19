import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    email: z.email("Please provide a valid email").toLowerCase().optional(),
  })
  .refine((data) => data.name || data.email, {
    message: "Please provide name or email",
  });

export const updateUserPasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});
