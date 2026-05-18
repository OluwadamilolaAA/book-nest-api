import Cart from "./cart.model";
import Book from "../book/book.model";
import BadRequestError from "../../common/errors/bad-request";
import NotFoundError from "../../common/errors/not_found";

type addToCartData = {
  bookId: string;
  quantity: number;
};

const getMyCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    "items.book",
    "title author price coverImage stock",
  );

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }
  return cart;
};

const addToCart = async (userId: string, data: addToCartData) => {
  const { bookId, quantity } = data;

  if (!bookId || !quantity) {
    throw new BadRequestError("Please provide book and quantity");
  }

  if (quantity < 1) {
    throw new BadRequestError("Quantity must be at least 1");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.stock < quantity) {
    throw new BadRequestError("Not enough stock available");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.book.toString() === bookId,
  );
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (book.stock < newQuantity) {
      throw new BadRequestError("Not enough stock available");
    }
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      book: book._id,
      quantity,
      price: book.price,
    });
  }
  await cart.save();
  return cart;
};

const updateCart = async (userId: string, bookId: string, quantity: number) => {
  if (!quantity || quantity < 1) {
    throw new BadRequestError("Quantity must be atleast 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const item = cart.items.find((item) => item.book.toString() === bookId);
  if (!item) {
    throw new NotFoundError("Book not found in cart");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.stock < quantity) {
    throw new BadRequestError("Not enough stock available");
  }
  item.quantity = quantity;
  await cart.save();
  return cart;
};

const removeCart = async (userId: string, bookId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const existingCart = cart.items.find(
    (item) => item.book.toString() === bookId,
  );
  if (!existingCart) {
    throw new NotFoundError("Book not found in the cart");
  }

  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

  await cart.save();
  return cart;
};

const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = [];
  await cart.save();
  return {
    msg: "Cart cleared successfully",
  };
};

export { getMyCart, addToCart, updateCart, removeCart, clearCart };
