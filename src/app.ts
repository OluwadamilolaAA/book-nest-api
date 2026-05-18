import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.route"
import userRoutes from "./modules/user/user.route";
import bookRoutes from "./modules/book/book.route";
import reviewRoutes from "./modules/review/review.route"

import errorHandler from "./common/middlewares/error-handler";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler)

export default app;