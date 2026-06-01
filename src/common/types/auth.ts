import { Request } from "express";
import { TokenUser } from "../utils/jwt";

export type AuthenticatedRequest = Request & {
  user?: TokenUser;
};
