import * as authService from "./auth.service";
import asyncWrapper from "../../common/middlewares/async-wrapper";
import { Response, Request } from "express";
import {
  attachResponseToCookies,
  clearCookies,
  TokenUser,
} from "../../common/utils/jwt";
import UnauthorizedError from "../../common/errors/unauthorized-error";

interface AuthRequest extends Request {
  user?: TokenUser;
}

const register = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return res
    .status(201)
    .json({ msg: result.msg });
});

const login = asyncWrapper(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip || "",
    userAgent: req.get("user-agent") || "",
  });

  attachResponseToCookies({ res, accessToken, refreshToken });
  return res.status(200).json({ msg: "User login successfully", user });
});

const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail({
    token: req.query.token as string,
    email: req.query.email as string,
  });

  return res.status(200).json({ result });
});

const forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body);
  return res.status(200).json({ result });
});
const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);
  return res.status(200).json({ result });
});

const logout = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Invalid authorization");
  }
  await authService.logout(req.user.userId);

  clearCookies(res);

  return res.status(200).json({ msg: "User logged out successfully" });
});

export { register, login, verifyEmail, forgotPassword, resetPassword, logout };
