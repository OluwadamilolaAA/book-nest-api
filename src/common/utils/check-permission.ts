import { Role } from "../../modules/user/user.model";
import UnauthorizedError from "../errors/unauthorized-error";
import { TokenUser } from "./jwt";

const checkPermissions = (requestUser: TokenUser, resourceUserId: string) => {
  // admin can access everything
  if (requestUser.role === Role.ADMIN) return;

  // normal user can access only their own resource
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnauthorizedError("Not authorized to access the resource");
};

export default checkPermissions;
