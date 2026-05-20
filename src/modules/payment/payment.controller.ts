import * as paymentService from "./payment.service";
import { Request, Response } from "express";
import { TokenUser } from "../../common/utils/jwt";
import { asyncWrapper } from "../../common/middlewares";
import { UnauthorizedError } from "../../common/errors";

interface AuthRequest extends Request {
  user?: TokenUser;
}

const initializePayment = asyncWrapper(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
    };

    const { orderId } = req.body;

    const payment = await paymentService.initializePayment(
        req.user.userId,
        orderId,
        req.user.email
    )
    res.status(200).json({ msg: "Payment initialized successfully", payment });
});

const verifyPayment = asyncWrapper(async (req: Request, res: Response) => {
    const reference = req.params.reference as string;

    const payment = await paymentService.verifyPayment(reference);
    res.status(200).json({ msg: "Payment verified successfully", payment });
});

const paystackWebhook = asyncWrapper(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;

  await paymentService.handleWebhook(signature, req.body as Buffer);

  res.sendStatus(200);
});

export { initializePayment, verifyPayment, paystackWebhook };