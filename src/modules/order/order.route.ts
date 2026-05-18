import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
} from "./order.controller";

import { authorizedPermission, isAuth } from "../../common/middlewares/isAuth";
import { Role } from "../user/user.model";

const router = express.Router();

router.post("/", isAuth, createOrder);
router.get("/my-orders", isAuth, getMyOrders);

router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllOrders);
router.get("/:id", isAuth, getSingleOrder);

router.patch(
  "/:id/status",
  isAuth,
  authorizedPermission(Role.ADMIN),
  updateOrderStatus,
);
router.patch("/:id/cancel", isAuth, cancelOrder);

export default router;
