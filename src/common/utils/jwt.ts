import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../../modules/user/user.model";
import { Response } from "express";
import { Role } from "../../modules/user/user.model";

type createJwtParams = {
  payload: Object;
  secret: Secret;
  expiresIn: SignOptions["expiresIn"];
};

type verifyJwtParams = {
  token: string;
  secret: Secret;
};

export type TokenUser = {
  userId: string;
  email: string;
  role: Role;
};

const createJwt = ({ payload, secret, expiresIn }: createJwtParams): string => {
  return jwt.sign({ payload }, secret, { expiresIn });
};

const verifyJwt = ({ token, secret }: verifyJwtParams) => {
  return jwt.verify(token, secret) as { payload: { user: TokenUser } };
};

const createTokenUser = (user: IUser): TokenUser => {
  return {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
};

const attachResponseToCookies = ({
  res,
  accessToken,
  refreshToken,
}: {
  res: Response;
  accessToken: string;
  refreshToken: string;
}) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const sevenDays = oneDay * 7;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + sevenDays),
    secure: process.env.NODE_ENV === "production",
    sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
  });
};

const clearCookies = (res: Response) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    signed: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    signed: true,
    expires: new Date(0),
  });
};

export {
  createJwt,
  verifyJwt,
  createTokenUser,
  attachResponseToCookies,
  clearCookies,
};
