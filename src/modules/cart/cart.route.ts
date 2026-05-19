import express from "express";
import { getMyCart, addToCart, updateCart, removeCart, clearCart } from "./cart.controller"
import { isAuth } from "../../common/middlewares/isAuth";
import validateRequest from "../../common/middlewares/validate-request";
import { idParamSchema } from "../../common/validations";
import { addToCartSchema, updateCartSchema } from "./cart.validation";
const router = express.Router();

router.get('/', isAuth, getMyCart);
router.post('/', isAuth, validateRequest({ body: addToCartSchema }), addToCart);
router.patch('/:id', isAuth, validateRequest({ params: idParamSchema, body: updateCartSchema }), updateCart);
router.delete('/:id', isAuth, validateRequest({ params: idParamSchema }), removeCart);
router.delete('/', isAuth, clearCart);

export default router;
