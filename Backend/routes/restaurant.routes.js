import express from "express";

import { registerRestaurant } from "../controllers/restaurant/registerRestaurant.controller.js";

import { loginRestaurant } from "../controllers/restaurant/loginRestaurant.controller.js";

import { getRestaurantProfile } from "../controllers/restaurant/getRestaurantProfile.controller.js";

import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";

import { updateRestaurantProfile } from "../controllers/restaurant/updateRestaurantProfile.controller.js";

import { updateRestaurantStatus } from "../controllers/restaurant/updateRestaurantStatus.controller.js";

import { createFood } from "../controllers/food/createFood.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";

import { getRestaurantFoods } from "../controllers/food/getRestaurantFoods.controller.js";

import { getRestaurantFoodBySlug } from "../controllers/food/getRestaurantFoodBySlug.controller.js";

import { updateFood } from "../controllers/food/updateFood.controller.js";

import { deleteFood } from "../controllers/food/deleteFood.controller.js";

import { getRestaurants } from "../controllers/restaurant/getRestaurants.controller.js";

import { getRestaurantDashboardController } from "../controllers/restaurant/dashboard.controller.js";

// import { getAvailableDeliveryAgents } from "../controllers/restaurant/getAvailableDeliveryAgents.controller.js";
// import { createDeliveryOffer } from "../controllers/restaurant/createDeliveryOffer.controller.js";
import { updateRestaurantLocation } from "../controllers/restaurant/updateRestaurantLocation.controller.js";

const router = express.Router();

router.post("/register", registerRestaurant);

router.post("/login", loginRestaurant);

router.get("/profile", restaurantAuthMiddleware, getRestaurantProfile);

router.patch(
  "/profile",
  restaurantAuthMiddleware,
  uploadImage("logo", "logo"),
  updateRestaurantProfile,
);

router.patch("/status", restaurantAuthMiddleware, updateRestaurantStatus);

router.post(
  "/foods",

  restaurantAuthMiddleware,

  uploadImage("foods", "image"),

  createFood,
);

router.get("/foods", restaurantAuthMiddleware, getRestaurantFoods);

// get food by slug
router.get(
  "/foods/:foodSlug",
  restaurantAuthMiddleware,
  getRestaurantFoodBySlug,
);

// get restaurant
router.get("/", getRestaurants);

// update food router
router.patch(
  "/foods/:foodSlug",
  restaurantAuthMiddleware,
  uploadImage("foods", "image"),
  updateFood,
);
router.get(
  "/dashboard",
  restaurantAuthMiddleware,
  getRestaurantDashboardController,
);

// delete food
router.delete("/foods/:foodSlug", restaurantAuthMiddleware, deleteFood);

// router.get(
//   "/orders/:orderNumber/delivery-agents",
//   restaurantAuthMiddleware,
//   getAvailableDeliveryAgents,
// );

// router.post(
//   "/orders/:orderNumber/delivery-offer",
//   restaurantAuthMiddleware,
//   createDeliveryOffer,
// );

// loaction update
router.patch("/location", restaurantAuthMiddleware, updateRestaurantLocation);


export default router;
