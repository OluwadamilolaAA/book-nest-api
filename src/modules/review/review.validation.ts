import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1)
    .max(5),
  comment: z.string().trim().min(1, "Comment is required"),
});

export const updateReviewSchema = createReviewSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Please provide fields to update",
  },
);
