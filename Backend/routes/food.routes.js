import express from "express";
// =========================
// FOOD CONTROLLERS
// =========================

import { getFoods } from "../controllers/food/getFoods.controller.js";

import { getFoodBySlug } from "../controllers/food/getFoodBySlug.controller.js";

const router = express.Router();

router.get("/", getFoods);

// =========================
// GET FOODS BY CATEGORY
// GET /api/foods/category/:categorySlug
// =========================
router.get("/:foodSlug", getFoodBySlug);
// =========================
// GET FOODS BY RESTAURANT
// Restaurant Details Page
// GET /api/foods/restaurant/:restaurantSlug
// =========================

// =========================
// GET SINGLE PUBLIC FOOD
// GET /api/foods/:foodSlug
// =========================

// ======================================================
// RESTAURANT FOOD MANAGEMENT
// RESTAURANT AUTH REQUIRED
// ======================================================

// =========================
// GET MY FOODS
// GET /api/foods/manage/my-foods
// =========================

// ===========
// PATCH /api/foods/manage/:foodSlug/availability
// =========================

// =========================
// DELETE FOOD
// DELETE /api/foods/manage/:foodSlug
// =========================

export default router;
