import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import {
  authRoutes,
  bookRoutes,
  cartRoutes,
  orderRoutes,
  rentalRoutes,
  reviewRoutes,
  userRoutes,
  paymentRoutes,
  uploadRoutes,
} from "./modules";

import { errorHandler } from "./common/middlewares";

const app = express();
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(errorHandler);

export default app;
