import express from "express";

import { loginAdmin } from "../controllers/admin/loginAdmin.controller.js";

import { getPendingRestaurants } from "../controllers/admin/getPendingRestaurants.controller.js";

import { approveRestaurant } from "../controllers/admin/approveRestaurant.controller.js";

import { rejectRestaurant } from "../controllers/admin/rejectRestaurant.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.middleware.js";

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

export default router;
