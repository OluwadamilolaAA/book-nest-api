import { Role } from "../../modules/user/user.model";
import UnauthorizedError from "../errors/unauthorized-error";
import { verifyJwt, TokenUser } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

const isAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.signedCookies.accessToken;

  if (!token) {
    throw new UnauthorizedError("Invalid Authorization");
  }

  try {
    const decoded = verifyJwt({
      token,
      secret: process.env.ACCESS_TOKEN_SECRET as string,
    }) as { payload: { user: TokenUser } };

    req.user = decoded.payload.user;

    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid authorization");
  }
};

const authorizedPermission = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as TokenUser | undefined;

    if (!user) {
      throw new UnauthorizedError("Invalid authorization");
    }

    if (!roles.includes(user.role as Role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }

    next();
  };
};

export { isAuth, authorizedPermission };
