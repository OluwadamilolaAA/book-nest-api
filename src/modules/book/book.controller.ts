import * as bookService from "./book.service";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import { Request, Response } from "express";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import { AuthenticatedRequest } from "../../common/types/auth";

const createBooks = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const book = await bookService.createBooks(req.user.userId, req.body);

  return res.status(201).json({
    msg: "Book created successfully",
    book,
  });
});

const getAllBooks = asyncWrapper(async (req: Request, res: Response) => {
  const result = await bookService.getAllBooks(req.query);

  return res.status(200).json(result);
});

const getSingleBook = asyncWrapper(async (req: Request, res: Response) => {
  const bookId = req.params.id as string;

  const book = await bookService.getSingleBook(bookId);

  return res.status(200).json({ book });
});

const updateBook = asyncWrapper(async (req: Request, res: Response) => {
  const bookId = req.params.id as string;

  const book = await bookService.updateBook(bookId, req.body);

  return res.status(200).json({
    msg: "Book updated successfully",
    book,
  });
});

const deleteBook = asyncWrapper(async (req: Request, res: Response) => {
  const bookId = req.params.id as string;

  const result = await bookService.deleteBook(bookId);

  return res.status(200).json(result);
});

export { createBooks, getAllBooks, getSingleBook, updateBook, deleteBook };
