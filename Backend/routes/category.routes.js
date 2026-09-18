import express from "express";

import { getPublicCategories } from "../controllers/category/getPublicCategories.controller.js";

const router = express.Router();

router.get("/", getPublicCategories);

export default router;
