import * as rentalService from "./rental.service";
import { Request, Response } from "express";
import { TokenUser } from "../../common/utils/jwt";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import UnauthorizedError from "../../common/errors/unauthorized-error";

interface AuthRequest extends Request {
  user?: TokenUser;
}

const rentBook = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  const rental = await rentalService.rentBook(req.user.userId, req.body);
  res.status(201).json({ msg: "Book rented successfully", rental });
});

const getMyRentals = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const rentals = await rentalService.getMyRentals(req.user.userId);
  res.status(200).json({ msg: "My rentals retrieved successfully", rentals });
});

const getAllRentals = asyncWrapper(async (req: Request, res: Response) => {
  const rentals = await rentalService.getAllRentals();
  res.status(200).json({ msg: "All rentals retrieved successfully", rentals });
});

const getSingleRental = asyncWrapper(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Invalid authorization");
    }

    const rentalId = req.params.id as string;
    const rental = await rentalService.getSingleRental(rentalId, req.user);
    res.status(200).json({ msg: "Rental retrieved successfully", rental });
  },
);

const returnBook = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const rentalId = req.params.id as string;
  const rental = await rentalService.returnBook(rentalId, req.user);
  res.status(200).json({ msg: "Book returned successfully", rental });
});

const cancelRental = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }

  const rentalId = req.params.id as string;
  const rental = await rentalService.cancelRental(rentalId, req.user);
  res.status(200).json({ msg: "Rental cancelled successfully", rental });
});

export {
  rentBook,
  getMyRentals,
  getAllRentals,
  getSingleRental,
  returnBook,
  cancelRental,
};
