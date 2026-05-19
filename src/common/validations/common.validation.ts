import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");

export const idParamSchema = z.object({
  id: objectIdSchema,
});

export const bookIdParamSchema = z.object({
  bookId: objectIdSchema,
});

export const optionalTrimmedString = z
  .string()
  .trim()
  .min(1)
  .optional();

export const positiveIntSchema = z.coerce
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than 0");

export const nonNegativeNumberSchema = z.coerce
  .number()
  .min(0, "Must be greater than or equal to 0");
