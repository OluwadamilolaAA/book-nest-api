import * as orderService from "./order.service";
import { Request, Response } from "express";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import { AuthenticatedRequest } from "../../common/types/auth";

const createOrder = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const order = await orderService.createOrder(req.user.userId, req.body);
  res.status(201).json({ msg: "Order created successfully", order });
});

const getMyOrders = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const orders = await orderService.getMyOrders(req.user.userId);
  return res.status(200).json({ msg: "Orders retrieved successfully", orders });
});

const getAllOrders = asyncWrapper(async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  return res.status(200).json({ msg: "Orders retrieved successfully", orders });
});

const getSingleOrder = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const orderId = req.params.id as string;
  const order = await orderService.getSingleOrder(orderId, req.user);
  return res.status(200).json({ msg: "Order retrieved successfully", order });
});

const updateOrderStatus = asyncWrapper(async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const order = await orderService.updateOrderStatus(orderId, req.body);
  return res
    .status(200)
    .json({ msg: "Order status updated successfully", order });
});

const cancelOrder = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const orderId = req.params.id as string;
  const order = await orderService.cancelOrder(orderId, req.user);
  return res.status(200).json({ msg: "Order canceled successfully", order });
});

export {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
};
