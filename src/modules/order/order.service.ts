import Order from "./order.model";
import Cart from "../cart/cart.model";
import Book from "../book/book.model";
import { OrderStatus, PaymentStatus, DeliveryMethod } from "./order.model";
import BadRequestError from "../../common/errors/bad-request";
import NotFoundError from "../../common/errors/not_found";
import mongoose from "mongoose";
import { TokenUser } from "../../common/utils/jwt";
import checkPermissions from "../../common/utils/check-permission";

const TAX_RATE = 0.075; // 7.5%
const SHIPPING_FEE = 2000;

type CreateOrderData = {
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
};

type UpdateOrderStatusData = {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
};

const createOrder = async (userId: string, data: CreateOrderData) => {
  const { deliveryMethod, deliveryAddress } = data;

  if (!deliveryMethod) {
    throw new BadRequestError("Delivery method is required");
  }

  if (deliveryMethod !== "pickup" && deliveryMethod !== "delivery") {
    throw new BadRequestError("Invalid delivery method");
  }

  if (deliveryMethod === "delivery" && !deliveryAddress) {
    throw new BadRequestError(
      "Delivery address is required for delivery method",
    );
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const book = await Book.findById(item.book).session(session);

      if (!book) {
        throw new NotFoundError("Book not found");
      }

      if (book.stock < item.quantity) {
        throw new BadRequestError(`Not enough stock for book: ${book.title}`);
      }

      book.stock -= item.quantity;
      await book.save({ session });

      orderItems.push({
        book: book._id,
        title: book.title,
        quantity: item.quantity,
        price: item.price,
      });

      subtotal += item.price * item.quantity;
    }

    const tax = subtotal * TAX_RATE;

    const shippingFee = deliveryMethod === "pickup" ? 0 : SHIPPING_FEE;

    const totalAmount = subtotal + tax + shippingFee;

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          subtotal,
          tax,
          shippingFee,
          totalAmount,
          deliveryMethod,
          deliveryAddress:
            deliveryMethod === DeliveryMethod.PICKUP
              ? "Pickup at store"
              : deliveryAddress,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
        },
      ],
      { session },
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId }).sort("-createdAt");

  return orders;
};

const getAllOrders = async () => {
  const Orders = await Order.find({})
    .populate("user", "name email")
    .sort("-createdAt");

  return Orders;
};

const getSingleOrder = async (orderId: string, user: TokenUser) => {
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  checkPermissions(user, order.user.toString());

  return order;
};

const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusData,
) => {
  const { status, paymentStatus, paymentReference } = data;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  if (data.status) {
    order.status = data.status;
  }
  if (data.paymentStatus) {
    order.paymentStatus = data.paymentStatus;
  }
  if (data.paymentReference) {
    order.paymentReference = data.paymentReference;
  }
  await order.save();
  return order;
};

const cancelOrder = async (orderId: string, user: TokenUser) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  checkPermissions(user, order.user.toString());

  if (order.paymentStatus === PaymentStatus.PAID) {
  throw new BadRequestError("Cannot cancel a paid order");
}

  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestError("Order is already cancelled");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: item.quantity } },
        { session },
      );
    }

    order.status = OrderStatus.CANCELLED;
    order.paymentStatus = PaymentStatus.FAILED;

    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
};
