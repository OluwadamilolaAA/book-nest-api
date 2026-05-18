import mongoose, { Schema, Document } from "mongoose";

export enum RentalStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export interface IRental extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  rentalStartDate: Date;
  rentalEndDate: Date;
  returnDate?: Date;
  rentalStatus: RentalStatus;
  rentalPrice: number;
  lateFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rentalStartDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rentalEndDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    rentalStatus: {
      type: String,
      enum: Object.values(RentalStatus),
      default: RentalStatus.ACTIVE,
    },
    rentalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const Rental = mongoose.model<IRental>("Rental", RentalSchema);

export default Rental;
