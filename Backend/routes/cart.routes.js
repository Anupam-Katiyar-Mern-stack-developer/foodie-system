import { addToCart } from "../controllers/cart/addToCart.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { getCart } from "../controllers/cart/getCart.controller.js";
import { updateCartItem } from "../controllers/cart/updateCartItem.controller.js";
import { removeCartItem } from "../controllers/cart/removeCartItem.controller.js";
import { clearCart } from "../controllers/cart/clearCart.controller.js";
import express from "express";

const router = express.Router();

// post cart items
router.post("/items", authMiddleware, addToCart);

//get cart items
router.get("/cart", authMiddleware, getCart);

// update cart item
router.patch("/cart/items/:foodSlug", authMiddleware, updateCartItem);

// remove cart item
router.delete("/cart/items/:foodSlug", authMiddleware, removeCartItem);

// clear cart route
router.delete("/cart", authMiddleware, clearCart);

export default router;
