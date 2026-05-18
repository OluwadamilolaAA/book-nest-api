import mongoose, { Schema, Document, Model } from "mongoose";
import Book from "../book/book.model";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewModel extends Model<IReview> {
  calculateAverageRating(bookId: mongoose.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview, ReviewModel>(
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

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (
  bookId: mongoose.Types.ObjectId
): Promise<void> {
  const result = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.ceil(result[0].averageRating),
      numOfReviews: result[0].numOfReviews,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};

ReviewSchema.post("save", async function () {
  await (this.constructor as ReviewModel).calculateAverageRating(this.book);
});

ReviewSchema.post("deleteOne", { document: true, query: false }, async function () {
  await (this.constructor as ReviewModel).calculateAverageRating(this.book);
});

const Review = mongoose.model<IReview, ReviewModel>("Review", ReviewSchema);

export default Review;