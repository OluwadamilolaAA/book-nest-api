import express from "express";
import { uploadImage } from "./upload.controller";
import { isAuth, authorizedPermission } from "../../common/middlewares";
import { Role } from "../user/user.model";
import upload from "../../common/middlewares/upload";

const router = express.Router();

router.post(
  "/image",
  isAuth,
  authorizedPermission(Role.ADMIN),
  upload.single("image"),
  uploadImage,
);

export default router;
