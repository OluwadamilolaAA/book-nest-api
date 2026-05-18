import express from "express"
const router = express.Router();
import { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword } from "./user.controller";
import { isAuth, authorizedPermission } from "../../common/middlewares/isAuth"
import { Role } from "./user.model";

router.get("/showMe", isAuth, showCurrentUser);
router.patch("/update-me", isAuth, updateUser);
router.patch("/update-password", isAuth, updateUserPassword);
router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllUsers);
router.get("/:id",isAuth, authorizedPermission(Role.ADMIN),  getUser);

export default router