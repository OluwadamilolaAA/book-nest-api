import { z } from "zod";
import {
  DeliveryMethod,
  OrderStatus,
  PaymentStatus,
} from "./order.model";

export const createOrderSchema = z
  .object({
    deliveryMethod: z.enum(DeliveryMethod),
    deliveryAddress: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.deliveryMethod === DeliveryMethod.PICKUP ||
      Boolean(data.deliveryAddress),
    {
      message: "Delivery address is required for delivery orders",
      path: ["deliveryAddress"],
    },
  );

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(OrderStatus).optional(),
    paymentStatus: z.enum(PaymentStatus).optional(),
    paymentReference: z.string().trim().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Please provide fields to update",
  });
