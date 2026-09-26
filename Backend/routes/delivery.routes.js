import express from "express";

import { registerDeliveryAgent } from "../controllers/delivery/registerDeliveryAgent.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";
import { loginDeliveryAgent } from "../controllers/delivery/loginDeliveryAgent.controller.js";

const router = express.Router();

router.post(
  "/register",

  uploadImage("delivery-agents", "image"),

  registerDeliveryAgent,
);

router.post("/login", loginDeliveryAgent);

export default router;
