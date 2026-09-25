import express from "express";

import { getPublicCategories } from "../controllers/category/getPublicCategories.controller.js";
import { getFoodsByCategory } from "../controllers/food/getFoodsByCategory.controller.js";

const router = express.Router();

router.get("/", getPublicCategories);

router.get("/:categorySlug/foods", getFoodsByCategory);

export default router;
