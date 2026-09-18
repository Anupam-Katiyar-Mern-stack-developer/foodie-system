import express from "express";

import { loginAdmin } from "../controllers/admin/loginAdmin.controller.js";

import { getPendingRestaurants } from "../controllers/admin/getPendingRestaurants.controller.js";

import { approveRestaurant } from "../controllers/admin/approveRestaurant.controller.js";

import { rejectRestaurant } from "../controllers/admin/rejectRestaurant.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.middleware.js";

import { createCategory } from "../controllers/admin/createCategory.controller.js";

import { getCategories } from "../controllers/admin/getCategories.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";

import { updateCategory } from "../controllers/admin/updateCategory.controller.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/restaurants/pending", adminAuthMiddleware, getPendingRestaurants);

router.patch(
  "/restaurants/:restaurantSlug/approve",
  adminAuthMiddleware,
  approveRestaurant,
);

router.patch(
  "/restaurants/:restaurantSlug/reject",
  adminAuthMiddleware,
  rejectRestaurant,
);

router.post(
  "/categories",
  adminAuthMiddleware,
  uploadImage("categories", "image"),
  createCategory,
);

router.get("/categories", adminAuthMiddleware, getCategories);

router.patch(
  "/categories/:categorySlug",

  adminAuthMiddleware,

  uploadImage("categories", "image"),

  updateCategory,
);
export default router;
