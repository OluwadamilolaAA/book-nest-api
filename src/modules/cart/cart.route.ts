import express from "express";
import { getMyCart, addToCart, updateCart, removeCart, clearCart } from "./cart.controller"
import { isAuth } from "../../common/middlewares/isAuth";
const router = express.Router();

router.get('/', isAuth, getMyCart);
router.post('/', isAuth, addToCart);
router.patch('/:id', isAuth, updateCart);
router.delete('/:id', isAuth, removeCart);
router.delete('/', isAuth, clearCart);

export default router;