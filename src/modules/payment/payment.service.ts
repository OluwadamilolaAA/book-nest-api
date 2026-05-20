import axios from "axios";
import crypto from "crypto";
import Order, { PaymentStatus, OrderStatus } from "../order/order.model";
import { BadRequestError, NotFoundError } from "../../common/errors";

const initializePayment = async (
  userId: string,
  orderId: string,
  email: string,
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.user.toString() !== userId) {
    throw new BadRequestError("You cannot pay for this order");
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new BadRequestError("Order is already paid");
  }

  const reference = `booknest_${orderId}_${Date.now()}`;

  const response = await axios.post(
    process.env.PAYSTACK_INITIALIZE_URL as string,
    {
      email,
      amount: Math.round(order.totalAmount * 100),
      reference,
      callback_url: `${process.env.CLIENT_URL}/payment/callback`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  order.paymentReference = reference;
  await order.save();

  return response.data.data;
};

const verifyPayment = async (reference: string) => {
  const response = await axios.get(
    `${process.env.PAYSTACK_VERIFY_URL}/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const paymentData = response.data.data;

  const order = await Order.findOne({ paymentReference: reference });

  if (!order) {
    throw new NotFoundError("Order not found for this payment");
  }

  if (paymentData.status === "success") {
    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.PAID;
    await order.save();
  }

  return {
    status: paymentData.status,
    order,
  };
};

const handleWebhook = async (signature: string, payload: Buffer) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(payload)
    .digest("hex");

  if (hash !== signature) {
    throw new BadRequestError("Invalid webhook signature");
  }

  const eventPayload = JSON.parse(payload.toString());

  const event = eventPayload.event;

  if (event === "charge.success") {
    const paymentData = eventPayload.data;
    const reference = paymentData.reference;

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      throw new NotFoundError("Order not found for this payment");
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      return;
    }

    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.PAID;

    await order.save();
  }
};
export { initializePayment, verifyPayment, handleWebhook };
