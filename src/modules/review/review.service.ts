import Review from "./review.model";
import Book from "../book/book.model";
import BadRequestError from "../../common/errors/bad-request";
import NotFoundError from "../../common/errors/not_found";
import checkPermissions from "../../common/utils/check-permission";
import { TokenUser } from "../../common/utils/jwt";

type CreateReviewData = {
  rating: number;
  comment: string;
};

type UpdateReviewData = Partial<CreateReviewData>;

const createReviews = async (
  userId: string,
  bookId: string,
  data: CreateReviewData
) => {
  const { rating, comment } = data;

  if (!userId || !bookId || !rating || !comment) {
    throw new BadRequestError("All fields are required");
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  const alreadyReviewed = await Review.findOne({
    book: bookId,
    user: userId,
  });

  if (alreadyReviewed) {
    throw new BadRequestError("You've already reviewed this book");
  }

  const review = await Review.create({
    rating,
    comment,
    book: bookId,
    user: userId,
  });

  return review;
};

const getAllReviews = async () => {
  const reviews = await Review.find({})
    .populate("user", "name")
    .populate("book", "title price author");

  return reviews;
};

const getSingleReview = async (reviewId: string) => {
  const review = await Review.findById(reviewId)
    .populate("user", "name")
    .populate("book", "title price author");

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  return review;
};

const updateReview = async (
  reviewId: string,
  data: UpdateReviewData,
  user: TokenUser
) => {
  if (Object.keys(data).length === 0) {
    throw new BadRequestError("Please provide fields to update");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new NotFoundError(`No review found with this Id: ${reviewId}`);
  }

  checkPermissions(user, review.user.toString());

  Object.assign(review, data);

  await review.save();

  return review;
};

const deleteReview = async (reviewId: string, user: TokenUser) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  checkPermissions(user, review.user.toString());

  await review.deleteOne();

  return {
    msg: "Review deleted successfully",
  };
};

const getSingleBookReviews = async (bookId: string) => {
  const reviews = await Review.find({ book: bookId })
    .populate("user", "name");

  return reviews;
};

export {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBookReviews
};