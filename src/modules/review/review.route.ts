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

router.get("/", getAllReviews);
router.get("/book/:bookId", getSingleBookReviews);
router.get("/:id", getSingleReview);
router.post("/book/:bookId", isAuth, createReviews);
router.patch("/:id", isAuth, updateReview);
router.delete("/:id", isAuth, deleteReview);

export default router;
