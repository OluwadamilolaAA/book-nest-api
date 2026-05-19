import express from "express";
import { initializePayment, verifyPayment } from "./payment.controller";
import { isAuth } from "../../common/middlewares";
const router = express.Router();

router.post("/initialize", isAuth, initializePayment);
router.get("/verify/:refrence", verifyPayment);

export default router;