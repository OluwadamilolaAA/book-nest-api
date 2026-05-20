import Book from "./book.model";
import BadRequestError from "../../common/errors/bad-request";
import NotFoundError from "../../common/errors/not_found";
import Review from "../review/review.model";
type CreateBookData = {
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
  pages?: number;
  isAvailableForRent?: boolean;
};

type UpdateBookData = Partial<CreateBookData>;

type BookQuery = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

const createBooks = async (userId: string, data: CreateBookData) => {
  const book = await Book.create({
    ...data,
    createdBy: userId,
  });
  return book;
};

const getAllBooks = async (query: BookQuery) => {
  const { search, category, sort, minPrice, maxPrice } = query;

  const queryObject: any = {};

  if (search) {
    queryObject.$text = { $search: search };
  }

  if (category) {
    queryObject.category = category;
  }
  if (minPrice || maxPrice) {
    queryObject.price = {};

    if (minPrice) {
      queryObject.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      queryObject.price.$lte = Number(maxPrice);
    }
  }
  let result = Book.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  } else if (sort === "oldest") {
    result = result.sort("createdAt");
  } else if (sort === "price-lowest") {
    result = result.sort("price");
  } else if (sort === "price-highest") {
    result = result.sort("-price");
  } else {
    result = result.sort("-createdAt");
  }

  // set pagination

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const books = await result;

  const totalBooks = await Book.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalBooks / limit);

  return {
    books,
    totalBooks,
    numOfPages,
    currentPage: page,
  };
};

const getSingleBook = async (bookId: string) => {
  const book = await Book.findById(bookId).populate("reviews");
  if (!book) {
    throw new NotFoundError(`No book found with this Id: ${bookId}`);
  }
  return book;
};

const updateBook = async (bookId: string, data: UpdateBookData) => {

  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError(`No book found with this Id: ${bookId}`);
  }

  Object.assign(book, data);

  await book.save();

  return book;
};

const deleteBook = async (bookId: string) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError("Book not found");
  }
  await Review.deleteMany({ book: book._id });
  await book.deleteOne();

  return {
    msg: "Book deleted successfully",
  };
};

export { createBooks, getAllBooks, getSingleBook, updateBook, deleteBook };
