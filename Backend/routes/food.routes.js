import express from "express";

import { uploadImage } from "../middleware/upload.middleware.js";
import { restaurantAuthMiddleware } from "../middleware/restaurantAuth.middleware.js";

// =========================
// FOOD CONTROLLERS
// =========================



import { getFoods } from "../controllers/food/getFoods.controller.js";



const router = express.Router();

// ======================================================
// PUBLIC FOOD ROUTES
// CUSTOMER SIDE
// ======================================================

// =========================
// GET ALL FOODS
// Home / Search / Food listing
// GET /api/foods
// =========================

router.get("/", getFoods);

// =========================
// GET FOODS BY CATEGORY
// GET /api/foods/category/:categorySlug
// =========================



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



// =========================
// GET MY FOOD BY SLUG
// GET /api/foods/manage/my-foods/:foodSlug
// =========================





// =========================
// UPDATE FOOD AVAILABILITY
// PATCH /api/foods/manage/:foodSlug/availability
// =========================



// =========================
// DELETE FOOD
// DELETE /api/foods/manage/:foodSlug
// =========================



export default router;
