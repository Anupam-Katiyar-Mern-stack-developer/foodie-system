import express from "express";

// ==============================
// AUTH MIDDLEWARES
// ==============================

import { authMiddleware } from "../middleware/auth.middleware.js";

import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";

// ==============================
// USER ORDER CONTROLLERS
// ==============================

import { placeOrder } from "../controllers/order/placeOrder.controller.js";

import { getUserOrders } from "../controllers/order/getUserOrders.controller.js";

import { getUserOrderByNumber } from "../controllers/order/getUserOrderByNumber.controller.js";

// ==============================
// RESTAURANT ORDER CONTROLLERS
// ==============================

import { getRestaurantOrders } from "../controllers/order/getRestaurantOrders.controller.js";

import { getRestaurantOrderByNumber } from "../controllers/order/getRestaurantOrderByNumber.controller.js";

import { acceptRestaurantOrder } from "../controllers/order/acceptRestaurantOrder.controller.js";

import { rejectRestaurantOrder } from "../controllers/order/rejectRestaurantOrder.controller.js";

import { markOrderPreparing } from "../controllers/order/markOrderPreparing.controller.js";

import { markOrderReady } from "../controllers/order/markOrderReady.controller.js";

const router = express.Router();

// =====================================
// USER ORDER ROUTES
// =====================================

router.post("/user/orders", authMiddleware, placeOrder);

router.get("/user/orders", authMiddleware, getUserOrders);

router.get("/user/orders/:orderNumber", authMiddleware, getUserOrderByNumber);

// =====================================
// RESTAURANT ORDER ROUTES
// =====================================

router.get("/restaurant/orders", restaurantAuthMiddleware, getRestaurantOrders);

router.get(
  "/restaurant/orders/:orderNumber",
  restaurantAuthMiddleware,
  getRestaurantOrderByNumber,
);

router.patch(
  "/restaurant/orders/:orderNumber/accept",
  restaurantAuthMiddleware,
  acceptRestaurantOrder,
);

router.patch(
  "/restaurant/orders/:orderNumber/reject",
  restaurantAuthMiddleware,
  rejectRestaurantOrder,
);

router.patch(
  "/restaurant/orders/:orderNumber/preparing",
  restaurantAuthMiddleware,
  markOrderPreparing,
);

router.patch(
  "/restaurant/orders/:orderNumber/ready",
  restaurantAuthMiddleware,
  markOrderReady,
);

export default router;
