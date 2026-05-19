import express from "express"
const router = express.Router();
import { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword } from "./user.controller";
import { isAuth, authorizedPermission } from "../../common/middlewares/isAuth"
import { Role } from "./user.model";
import validateRequest from "../../common/middlewares/validate-request";
import { idParamSchema } from "../../common/validations";
import { updateUserPasswordSchema, updateUserSchema } from "./user.validation";

router.get("/showMe", isAuth, showCurrentUser);
router.patch("/update-me", isAuth, validateRequest({ body: updateUserSchema }), updateUser);
router.patch("/update-password", isAuth, validateRequest({ body: updateUserPasswordSchema }), updateUserPassword);
router.get("/", isAuth, authorizedPermission(Role.ADMIN), getAllUsers);
router.get("/:id",isAuth, authorizedPermission(Role.ADMIN), validateRequest({ params: idParamSchema }),  getUser);

export default router
