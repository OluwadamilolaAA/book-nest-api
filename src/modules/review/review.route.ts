import express from "express";
const router = express.Router();
import {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
getSingleBookReviews
} from "./review.controller";
import { isAuth } from "../../common/middlewares/isAuth";
import validateRequest from "../../common/middlewares/validate-request";
import { bookIdParamSchema, idParamSchema } from "../../common/validations";
import { createReviewSchema, updateReviewSchema } from "./review.validation";

router.get("/", getAllReviews);
router.get("/book/:bookId", validateRequest({ params: bookIdParamSchema }), getSingleBookReviews);
router.get("/:id", validateRequest({ params: idParamSchema }), getSingleReview);
router.post("/book/:bookId", isAuth, validateRequest({ params: bookIdParamSchema, body: createReviewSchema }), createReviews);
router.patch("/:id", isAuth, validateRequest({ params: idParamSchema, body: updateReviewSchema }), updateReview);
router.delete("/:id", isAuth, validateRequest({ params: idParamSchema }), deleteReview);

export default router;
