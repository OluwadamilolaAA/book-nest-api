import * as cartService from "./cart.service"
import asyncWrapper from "../../common/middlewares/async-wrapper"
import { Request, Response } from "express"
import { TokenUser } from "../../common/utils/jwt";
import UnauthorizedError from "../../common/errors/unauthorized-error";

interface AuthRequest extends Request {
  user?: TokenUser;
}


const getMyCart = asyncWrapper(async(req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
      };

    const cart = await cartService.getMyCart(req.user?.userId)
    return res.status(200).json({ msg: "Cart fetch successfully", cart})
});

const addToCart = asyncWrapper(async(req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
      };

      const cart = await cartService.addToCart(req.user.userId, req.body)
       return res.status(200).json({ msg: "Cart added successfully", cart})
});

const updateCart = asyncWrapper(async(req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
      };

      const bookId = req.params.id as string
      const { quantity } = req.body

    const cart = await cartService.updateCart(req.user.userId, bookId, quantity)
    return res.status(200).json({ msg: "Cart updated successfully", cart})
});

const removeCart = asyncWrapper(async(req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
      };

      const bookId = req.params.id as string 

    const cart = await cartService.removeCart(req.user.userId, bookId)
    return res.status(200).json({ msg: "Cart deleted successfully", cart})
});

const clearCart = asyncWrapper(async(req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedError("Invalid authorization");
      };
    const cart = await cartService.clearCart(req.user.userId)
    return res.status(200).json({ msg: "Cart cleared successfully"})
});



export{ getMyCart, addToCart, updateCart, removeCart, clearCart }
