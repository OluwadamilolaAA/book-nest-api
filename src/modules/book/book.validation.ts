import { z } from "zod";
import {
  nonNegativeNumberSchema,
  optionalTrimmedString,
  positiveIntSchema,
} from "../../common/validations";

export const createBookSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: nonNegativeNumberSchema,
  rentalPrice: nonNegativeNumberSchema,
  stock: z.coerce.number().int("Stock must be a whole number").min(0),
  coverImage: z.string().trim().min(1, "Cover image is required"),
  publisher: z.string().trim().min(1, "Publisher is required"),
  isbn: z.string().trim().min(1, "ISBN is required"),
  language: z.string().trim().min(1, "Language is required"),
  pages: positiveIntSchema.optional(),
  isAvailableForRent: z.coerce.boolean().optional(),
});

export const updateBookSchema = createBookSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Please provide fields to update",
  },
);

export const getBooksQuerySchema = z.object({
  search: optionalTrimmedString,
  category: optionalTrimmedString,
  minPrice: nonNegativeNumberSchema.optional(),
  maxPrice: nonNegativeNumberSchema.optional(),
  sort: z
    .enum(["latest", "oldest", "price-lowest", "price-highest"])
    .optional(),
  page: positiveIntSchema.optional(),
  limit: positiveIntSchema.optional(),
});
