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
import validateRequest from "../../common/middlewares/validate-request";
import { idParamSchema } from "../../common/validations";
import { rentBookSchema } from "./rental.validation";
const router = express.Router();

router.post("/", isAuth, validateRequest({ body: rentBookSchema }), rentBook);
router.get("/my-rentals", isAuth, getMyRentals);
router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllRentals);
router.get("/:id", isAuth, validateRequest({ params: idParamSchema }), getSingleRental);
router.post("/:id/return", isAuth, validateRequest({ params: idParamSchema }), returnBook);
router.post("/:id/cancel", isAuth, validateRequest({ params: idParamSchema }), cancelRental);

export default router;
