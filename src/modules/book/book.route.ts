import express from "express";
const router = express.Router();
import {
  createBooks,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
} from "./book.controller";
import { authorizedPermission, isAuth } from "../../common/middlewares/isAuth";
import { Role } from "../user/user.model";

router.post("/", isAuth, authorizedPermission(Role.ADMIN), createBooks);
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.patch("/update-book/:id", isAuth, authorizedPermission(Role.ADMIN), updateBook);
router.delete("/delete-book/:id", isAuth, authorizedPermission(Role.ADMIN), deleteBook)

export default router;