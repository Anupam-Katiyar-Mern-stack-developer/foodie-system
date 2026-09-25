import express from "express";

import { getPublicRestaurant } from "../controllers/restaurant/getPublicRestaurant.controller.js";

import { getFoodsByRestaurant } from "../controllers/food/getFoodsByRestaurant.controller.js";

const router = express.Router();

router.get("/:restaurantSlug", getPublicRestaurant);

router.get("/:restaurantSlug/foods", getFoodsByRestaurant);

export default router;
