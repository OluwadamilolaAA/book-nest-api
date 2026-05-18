import { Role } from "../../modules/user/user.model";
import UnauthorizedError from "../errors/unauthorized-error";
import { verifyJwt, TokenUser } from "../utils/jwt"
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: TokenUser;
}

const isAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.signedCookies.accessToken;
  if (!token) {
    throw new UnauthorizedError("Invalid Authorization");
  }
  try {
    const decoded = verifyJwt({
      token,
      secret: process.env.ACCESS_TOKEN_SECRET as string,
    });

    req.user = decoded.payload.user;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid authorization");
  }
};

const authorizedPermission = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if(!req.user){
      throw new UnauthorizedError("Invalid authorization");
    }
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export { isAuth, authorizedPermission };
