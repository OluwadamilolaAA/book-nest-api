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
import validateRequest from "../../common/middlewares/validate-request";
import { idParamSchema } from "../../common/validations";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";

const router = express.Router();

router.post("/", isAuth, validateRequest({ body: createOrderSchema }), createOrder);
router.get("/my-orders", isAuth, getMyOrders);

router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllOrders);
router.get("/:id", isAuth, validateRequest({ params: idParamSchema }), getSingleOrder);

router.patch(
  "/:id/status",
  isAuth,
  authorizedPermission(Role.ADMIN),
  validateRequest({ params: idParamSchema, body: updateOrderStatusSchema }),
  updateOrderStatus,
);
router.patch("/:id/cancel", isAuth, validateRequest({ params: idParamSchema }), cancelOrder);

export default router;
