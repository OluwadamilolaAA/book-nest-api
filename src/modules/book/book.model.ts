import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  rentalPrice: number;
  stock: number;
  coverImage: string;
  publisher: string;
  isbn: string;
  language: string;
  pages: number;
  averageRating: number;
  numOfReviews: number;
  isAvailableForRent: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    rentalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    coverImage: {
      type: String,
      required: true,
    },

    publisher: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    pages: {
      type: Number,
      min: 1,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    isAvailableForRent: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
  }
);

BookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false
})

BookSchema.index({ title: "text", author: "text" });

const Book = mongoose.model<IBook>("Book", BookSchema);

export default Book;