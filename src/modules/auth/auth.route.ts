import express from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword, logout } from "./auth.controller";
import rateLimiter from "express-rate-limit";
import { isAuth } from "../../common/middlewares";
import validateRequest from "../../common/middlewares/validate-request";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verifyEmailSchema,
} from "./auth.validation";

const router = express.Router();
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes",
})

router.post('/register', apiLimiter, validateRequest({ body: registerSchema }), register);
router.post("/login", apiLimiter, validateRequest({ body: loginSchema }), login);
router.get("/verify-email", validateRequest({ query: verifyEmailSchema }), verifyEmail);
router.post("/forgot-password", validateRequest({ body: forgotPasswordSchema }), forgotPassword);
router.post("/reset-password", validateRequest({ body: resetPasswordSchema }), resetPassword);
router.post("/logout", isAuth, logout)

export default router
