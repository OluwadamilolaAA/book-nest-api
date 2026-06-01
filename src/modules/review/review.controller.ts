import * as reviewService from "./review.service";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import { Response, Request } from "express";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import { AuthenticatedRequest } from "../../common/types/auth";

const createReviews = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const bookId = req.params.bookId as string;

  const review = await reviewService.createReviews(
    req.user.userId,
    bookId,
    req.body,
  );

  return res.status(201).json({
    msg: "Review created successfully",
    review,
  });
});

const getAllReviews = asyncWrapper(async (_req: Request, res: Response) => {
  const reviews = await reviewService.getAllReviews();

  return res.status(200).json({
    count: reviews.length,
    reviews,
  });
});

const getSingleReview = asyncWrapper(async (req: Request, res: Response) => {
  const reviewId = req.params.id as string;

  const review = await reviewService.getSingleReview(reviewId);

  return res.status(200).json({ review });
});

const updateReview = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const reviewId = req.params.id as string;

  const review = await reviewService.updateReview(reviewId, req.body, req.user);

  return res.status(200).json({
    msg: "Review updated successfully",
    review,
  });
});

const deleteReview = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const reviewId = req.params.id as string;

  const result = await reviewService.deleteReview(reviewId, req.user);

  return res.status(200).json(result);
});

const getSingleBookReviews = asyncWrapper(
  async (req: Request, res: Response) => {
    const bookId = req.params.bookId as string;

    const reviews = await reviewService.getSingleBookReviews(bookId);

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  }
);

export {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBookReviews
};
