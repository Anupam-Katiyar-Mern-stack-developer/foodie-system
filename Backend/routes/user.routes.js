import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserProfile } from "../controllers/user/getUserProfile.controller.js";

const router=express.Router();

router.get("/profile",authMiddleware,getUserProfile);


export default router;