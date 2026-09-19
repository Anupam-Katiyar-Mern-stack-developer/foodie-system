import express from "express";

import { registerRestaurant } from "../controllers/restaurant/registerRestaurant.controller.js";

import { loginRestaurant } from "../controllers/restaurant/loginRestaurant.controller.js";

import { getRestaurantProfile } from "../controllers/restaurant/getRestaurantProfile.controller.js";

import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";

import { updateRestaurantProfile } from "../controllers/restaurant/updateRestaurantProfile.controller.js";

import { updateRestaurantStatus } from "../controllers/restaurant/updateRestaurantStatus.controller.js";

import { createFood } from "../controllers/food/createFood.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";

import { getRestaurantFoods } from "../controllers/food/getFood.controller.js";
const router = express.Router();

router.post("/register", registerRestaurant);

router.post("/login", loginRestaurant);

router.get("/profile", restaurantAuthMiddleware, getRestaurantProfile);

router.patch("/profile", restaurantAuthMiddleware, updateRestaurantProfile);

router.patch("/status", restaurantAuthMiddleware, updateRestaurantStatus);

router.post(
  "/foods",

  restaurantAuthMiddleware,

  uploadImage("foods", "image"),

  createFood,
);

router.get(
  "/foods",
  restaurantAuthMiddleware,
  getRestaurantFoods
);

export default router;
