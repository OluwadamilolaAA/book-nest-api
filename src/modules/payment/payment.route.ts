import express from "express";
import { initializePayment, verifyPayment, paystackWebhook, } from "./payment.controller";
import { isAuth } from "../../common/middlewares";
const router = express.Router();

router.post("/initialize", isAuth, initializePayment);
router.get("/verify/:reference", verifyPayment);
router.post("/webhook", paystackWebhook);

export default router;