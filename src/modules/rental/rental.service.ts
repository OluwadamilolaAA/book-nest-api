import Rental, { RentalStatus } from "./rental.model";
import Book from "../book/book.model";
import BadRequestError from "../../common/errors/bad-request";
import NotFoundError from "../../common/errors/not_found";
import { TokenUser } from "../../common/utils/jwt";
import mongoose from "mongoose";
import checkPermissions from "../../common/utils/check-permission";

const LATE_FEE_PER_DAY = 500;

type CreateRentalData = {
  bookId: string;
  rentalEndDate: string;
};

const rentBook = async (userId: string, data: CreateRentalData) => {
  const { bookId, rentalEndDate } = data;

  if (!bookId || !rentalEndDate) {
    throw new BadRequestError("Please provide book and rental end date");
  }

  const endDate = new Date(rentalEndDate);

  if (endDate <= new Date()) {
    throw new BadRequestError("Rental end date must be in the future");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findById(bookId).session(session);

    if (!book) {
      throw new NotFoundError("Book not found");
    }

    if (!book.isAvailableForRent) {
      throw new BadRequestError("This book is not available for rent");
    }

    if (book.isAvailableForRent && !book.rentalPrice) {
      throw new BadRequestError("Rental price is required for rentable books");
    }

    if (book.stock < 1) {
      throw new BadRequestError("Book is currently out of stock");
    }

    book.stock -= 1;
    await book.save({ session });

    const [rental] = await Rental.create(
      [
        {
          user: userId,
          book: book._id,
          rentalStartDate: new Date(),
          rentalEndDate: endDate,
          rentalStatus: RentalStatus.ACTIVE,
          rentalPrice: book.rentalPrice,
          lateFee: 0,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return rental;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyRentals = async (userId: string) => {
  const rentals = await Rental.find({ user: userId })
    .populate("book", "title author coverImage rentalPrice")
    .sort({ createdAt: -1 });
  return rentals;
};

const getAllRentals = async () => {
  const rentals = await Rental.find({})
    .populate("user", "name email")
    .populate("book", "title author coverImage rentalPrice")
    .sort({ createdAt: -1 });
  return rentals;
};

const getSingleRental = async (rentalId: string, user: TokenUser) => {
  const rental = await Rental.findById(rentalId)
    .populate("user", "name email")
    .populate("book", "title author coverImage rentalPrice");

  if (!rental) {
    throw new NotFoundError("Rental not found");
  }

  checkPermissions(user, rental.user.toString());

  return rental;
};

const returnBook = async (rentalId: string, user: TokenUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findById(rentalId).session(session);

    if (!rental) {
      throw new NotFoundError("Rental not found");
    }

    checkPermissions(user, rental.user.toString());

    if (rental.rentalStatus === RentalStatus.RETURNED) {
      throw new BadRequestError("Book has already been returned");
    }

    if (rental.rentalStatus === RentalStatus.CANCELLED) {
      throw new BadRequestError("Cancelled rental cannot be returned");
    }

    const returnDate = new Date();
    let lateFee = 0;

    if (returnDate > rental.rentalEndDate) {
      const diffInMs = returnDate.getTime() - rental.rentalEndDate.getTime();
      const lateDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      lateFee = lateDays * LATE_FEE_PER_DAY;
    }

    rental.returnDate = returnDate;
    rental.lateFee = lateFee;
    rental.rentalStatus = RentalStatus.RETURNED;

    await rental.save({ session });

    await Book.findByIdAndUpdate(
      rental.book,
      { $inc: { stock: 1 } },
      { session },
    );

    await session.commitTransaction();
    return rental;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelRental = async (rentalId: string, user: TokenUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findById(rentalId).session(session);

    if (!rental) {
      throw new NotFoundError("Rental not found");
    }

    checkPermissions(user, rental.user.toString());

    if (rental.rentalStatus !== RentalStatus.ACTIVE) {
      throw new BadRequestError("Only active rentals can be cancelled");
    }

    rental.rentalStatus = RentalStatus.CANCELLED;

    await rental.save({ session });

    await Book.findByIdAndUpdate(
      rental.book,
      { $inc: { stock: 1 } },
      { session },
    );

    await session.commitTransaction();
    return rental;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export {
  rentBook,
  getMyRentals,
  getAllRentals,
  getSingleRental,
  returnBook,
  cancelRental,
};
