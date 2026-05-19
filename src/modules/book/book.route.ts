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
import validateRequest from "../../common/middlewares/validate-request";
import { idParamSchema } from "../../common/validations";
import { createBookSchema, getBooksQuerySchema, updateBookSchema } from "./book.validation";

router.post("/", isAuth, authorizedPermission(Role.ADMIN), validateRequest({ body: createBookSchema }), createBooks);
router.get("/", validateRequest({ query: getBooksQuerySchema }), getAllBooks);
router.get("/:id", validateRequest({ params: idParamSchema }), getSingleBook);
router.patch("/update-book/:id", isAuth, authorizedPermission(Role.ADMIN), validateRequest({ params: idParamSchema, body: updateBookSchema }), updateBook);
router.delete("/delete-book/:id", isAuth, authorizedPermission(Role.ADMIN), validateRequest({ params: idParamSchema }), deleteBook)

export default router;
