import { Request, Response } from "express";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import * as userService from "./user.service";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import { AuthenticatedRequest } from "../../common/types/auth";

const getAllUsers = asyncWrapper(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ count: users.length, users });
});

const getUser = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const user = await userService.getUser(id);

  return res.status(200).json({ user });
});

const showCurrentUser = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Invalid authorization");
    }
    const user = await userService.showCurrentUser(req.user.userId);
    return res.status(200).json({ user });
  },
);

const updateUser = asyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  const user = await userService.updateUser(req.user.userId, req.body);
  return res.status(200).json({ user });
});

const updateUserPassword = asyncWrapper(async(req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
    const user = await userService.updateUserPassword(req.user.userId, req.body)
    return res.status(200).json({ msg: "User password Updated", user})
})

export { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword };
