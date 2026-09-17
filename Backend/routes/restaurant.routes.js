import express from "express";

import { registerRestaurant } from "../controllers/restaurant/registerRestaurant.controller.js";

import { loginRestaurant } from "../controllers/restaurant/loginRestaurant.controller.js";

import { getRestaurantProfile } from "../controllers/restaurant/getRestaurantProfile.controller.js";

import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";

const router = express.Router();

router.post("/register", registerRestaurant);

router.post("/login", loginRestaurant);

router.get("/profile", restaurantAuthMiddleware, getRestaurantProfile);

export default router;
