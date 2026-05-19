import { z } from "zod";
import { objectIdSchema, positiveIntSchema } from "../../common/validations";

export const addToCartSchema = z.object({
  bookId: objectIdSchema,
  quantity: positiveIntSchema,
});

export const updateCartSchema = z.object({
  quantity: positiveIntSchema,
});
