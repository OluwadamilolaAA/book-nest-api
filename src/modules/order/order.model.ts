import mongoose, { Schema, Document } from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  FAILED = "failed",
}

export enum DeliveryMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

type OrderItem = {
  book: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
};

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },

    tax: { type: Number, required: true },

    shippingFee: { type: Number, required: true },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },

    paymentReference: { type: String },

    deliveryMethod: {
      type: String,
      enum: Object.values(DeliveryMethod),
      default: DeliveryMethod.DELIVERY,
    },

    deliveryAddress: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
