import express from "express";
import {
  getSiteSettings,
  getCoupons,
} from "../controllers/admin/siteSettings.controller.js";
const router = express.Router();
router.get("/", getSiteSettings);
router.get("/offers", getCoupons);
export default router;
