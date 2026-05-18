import express from "express";
import { register, login, verifyEmail, forgotPassword, logout } from "./auth.controller";
import rateLimiter from "express-rate-limit";
import { isAuth } from "../../common/middlewares/isAuth";

const router = express.Router();
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes",
})

router.post('/register', apiLimiter, register);
router.post("/login", apiLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/logout", isAuth, logout)

export default router