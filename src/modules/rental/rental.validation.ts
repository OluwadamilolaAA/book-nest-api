import { z } from "zod";
import { objectIdSchema } from "../../common/validations";

export const rentBookSchema = z
  .object({
    bookId: objectIdSchema,
    rentalEndDate: z.coerce.date(),
  })
  .refine((data) => data.rentalEndDate > new Date(), {
    message: "Rental end date must be in the future",
    path: ["rentalEndDate"],
  })
  .transform((data) => ({
    ...data,
    rentalEndDate: data.rentalEndDate.toISOString(),
  }));
