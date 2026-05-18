import express from "express";
import {
  rentBook,
  getMyRentals,
  getAllRentals,
  getSingleRental,
  returnBook,
  cancelRental,
} from "./rental.controller";
import { authorizedPermission, isAuth } from "../../common/middlewares/isAuth";
import { Role } from "../user/user.model";
const router = express.Router();

router.post("/", isAuth, rentBook);
router.get("/my-rentals", isAuth, getMyRentals);
router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllRentals);
router.get("/:id", isAuth, getSingleRental);
router.post("/:id/return", isAuth, returnBook);
router.post("/:id/cancel", isAuth, cancelRental);

export default router;
