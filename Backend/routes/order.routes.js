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

// delivery agent

import { deliveryAuthMiddleware } from "../middleware/deliveryAuth.middleware.js";

import { getDeliveryOrderOffer } from "../controllers/order/getDeliveryOrderOffer.controller.js";

import { acceptDeliveryOrder } from "../controllers/order/acceptDeliveryOrder.controller.js";

import { rejectDeliveryOrder } from "../controllers/order/rejectDeliveryOrder.controller.js";

import { getActiveDeliveryOrder } from "../controllers/order/getActiveDeliveryOrder.controller.js";
import { markOrderOutForDelivery } from "../controllers/order/markOrderOutForDelivery.controller.js";

import { pickupDeliveryOrder } from "../controllers/order/pickupDeliveryOrder.controller.js";
import { completeDeliveryOrder } from "../controllers/order/completeDeliveryOrder.controller.js";

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

// =====================================
// DELIVERY AGENT ORDER ROUTES
// =====================================

router.get(
  "/delivery/orders/offers",
  deliveryAuthMiddleware,
  getDeliveryOrderOffer,
);

router.patch(
  "/delivery/orders/:orderNumber/accept",
  deliveryAuthMiddleware,
  acceptDeliveryOrder,
);

router.patch(
  "/delivery/orders/:orderNumber/reject",
  deliveryAuthMiddleware,
  rejectDeliveryOrder,
);
router.get(
  "/delivery/orders/active",
  deliveryAuthMiddleware,
  getActiveDeliveryOrder,
);

router.patch(
  "/delivery/orders/:orderNumber/pickup",
  deliveryAuthMiddleware,
  pickupDeliveryOrder,
);
router.patch(
  "/delivery/orders/:orderNumber/out-for-delivery",
  deliveryAuthMiddleware,
  markOrderOutForDelivery,
);
router.patch(
  "/delivery/orders/:orderNumber/delivered",
  deliveryAuthMiddleware,
  completeDeliveryOrder,
);
export default router;
