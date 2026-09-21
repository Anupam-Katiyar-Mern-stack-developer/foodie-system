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

import { updateCategoryStatus } from "../controllers/admin/updateCategoryStatus.controller.js";

import { deleteCategory } from "../controllers/admin/deleteCategory.controller.js";

import { getFoods } from "../controllers/admin/getFoods.controller.js";

import { getFoodBySlug } from "../controllers/admin/getFoodBySlug.controller.js";

const router = express.Router();

// login admin
router.post("/login", loginAdmin);

// get who restaurant pending
router.get("/restaurants/pending", adminAuthMiddleware, getPendingRestaurants);

// approve restaurant
router.patch(
  "/restaurants/:restaurantSlug/approve",
  adminAuthMiddleware,
  approveRestaurant,
);

// reject restaurant
router.patch(
  "/restaurants/:restaurantSlug/reject",
  adminAuthMiddleware,
  rejectRestaurant,
);

// create category
router.post(
  "/categories",
  adminAuthMiddleware,
  uploadImage("categories", "image"),
  createCategory,
);

// get cactegory
router.get("/categories", adminAuthMiddleware, getCategories);

// update category
router.patch(
  "/categories/:categorySlug",
  adminAuthMiddleware,
  uploadImage("categories", "image"),
  updateCategory,
);

// update categoryStatus
router.patch(
  "/categories/:categorySlug/status",
  adminAuthMiddleware,
  updateCategoryStatus,
);

// delete category
router.delete("/categories/:categorySlug", adminAuthMiddleware, deleteCategory);

// get all foods
router.get("/foods", adminAuthMiddleware, getFoods);

// get single food by foodslug
router.get("/foods/:foodSlug", adminAuthMiddleware, getFoodBySlug);

export default router;
