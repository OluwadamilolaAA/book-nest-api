import express from "express";
import {
  register,
  login,
  verifyEmail,
  socialCallback,
  forgotPassword,
  resetPassword,
  logout,
} from "./auth.controller";

import rateLimiter from "express-rate-limit";
import { isAuth } from "../../common/middlewares";
import validateRequest from "../../common/middlewares/validate-request";
import passport from "../../config/passport";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validation";

const router = express.Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post(
  "/register",
  apiLimiter,
  validateRequest({ body: registerSchema }),
  register,
);

router.post(
  "/login",
  apiLimiter,
  validateRequest({ body: loginSchema }),
  login,
);

router.get(
  "/verify-email",
  validateRequest({ query: verifyEmailSchema }),
  verifyEmail,
);

router.post(
  "/forgot-password",
  validateRequest({ body: forgotPasswordSchema }),
  forgotPassword,
);

router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  resetPassword,
);

router.post("/logout", isAuth, logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  socialCallback,
);


router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  socialCallback,
);

export default router;