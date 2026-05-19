import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Please provide a valid email").toLowerCase(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Verification token is required"),
  email: z.email("Please provide a valid email").toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please provide a valid email").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  email: z.email("Please provide a valid email").toLowerCase(),
  password: passwordSchema,
});
