import User, { Role } from "../user/user.model";
import Token from "./token.model";
import bcrypt from "bcrypt";
import BadRequestError from "../../common/errors/bad-request";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import { createJwt, createTokenUser } from "../../common/utils/jwt";
import crypto from "crypto";
import { StringValue } from "ms";
import hashString from "../../common/utils/hash-string";
import sendEmail from "../../common/utils/send-email";
import verifyEmailTemplate from "../../common/emails/verify-email";
import forgotPasswordTemplate from "../../common/emails/forgot-password";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
};

type verifyEmailData = {
  token: string;
  email: string;
};

type resetPasswordData = {
  token: string;
  email: string;
  password: string;
};

const register = async (data: RegisterData) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new BadRequestError("All fields are required");
  }

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role: Role = isFirstAccount ? Role.ADMIN : Role.USER;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(40).toString("hex");

  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    verificationToken,
  });

  const origin = process.env.APP_URL;
  const verifyEmailUrl = `${origin}/api/auth/verify-email?token=${verificationToken}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Verify your BookNest account",
    html: verifyEmailTemplate({
      name,
      verifyEmailUrl,
    }),
  });

  return {
    msg: "Success! Please check your email to verify your account",
  };
};

const login = async (data: LoginData) => {
  const { email, password, ip, userAgent } = data;

  if (!email || !password) {
    throw new BadRequestError("All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new UnauthorizedError("Please verify your account");
  }
  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString("hex");
  await Token.deleteMany({ user: user._id });

  await Token.create({
    refreshToken: hashString(refreshToken),
    ip,
    userAgent,
    user: user._id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  const accessToken = createJwt({
    payload: { user: tokenUser },
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
  });

  const refreshJwt = createJwt({
    payload: { user: tokenUser, refreshToken },
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
  });

  return {
    user: tokenUser,
    accessToken,
    refreshToken: refreshJwt,
  };
};

const verifyEmail = async (data: verifyEmailData) => {
  const { token, email } = data;

  if (!token || !email) {
    throw new BadRequestError("Invalid verification link");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Verification failed");
  }

  if (user.verificationToken !== token) {
    throw new UnauthorizedError("Verification failed");
  }

  user.isEmailVerified = true;
  user.verified = new Date();
  user.verificationToken = "";

  await user.save();
  return { msg: "Email verified successfully" };
};

const forgotPassword = async (data: { email: string }) => {
  const { email } = data;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("No user with this email");
  }

  const passwordToken = crypto.randomBytes(40).toString("hex");
  const origin = process.env.APP_URL;
  const resetUrl = `${origin}/api/auth/reset-password?token=${passwordToken}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Reset your BookNest password",
    html: forgotPasswordTemplate({
      name: user.name,
      resetUrl,
    }),
  });

  user.passwordToken = hashString(passwordToken);
  user.passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 10);

  await user.save();
  return {
    msg: "Please check your email for reset password link",
  };
};

const resetPassword = async (data: resetPasswordData) => {
  const { token, email, password } = data;

  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all fields");
  };
  if (password.length < 6) {
  throw new BadRequestError("Password must be at least 6 characters long");
}

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("No user with this email");
  }

  const currentTime = new Date();
  const hashToken = hashString(token);

  if (
    user.passwordToken !== hashToken ||
    !user.passwordTokenExpirationDate ||
    user.passwordTokenExpirationDate < currentTime
  ) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.passwordToken = "";
  user.passwordTokenExpirationDate = undefined;

  await user.save();
  return { msg: "Password reset successfully" };
};

const logout = async (userId: string) => {
  await Token.findOneAndUpdate(
    { user: userId },
    { isValid: false }
  );

  return { msg: "Logout successfully" };
};

export { register, login, verifyEmail, forgotPassword, resetPassword, logout };
