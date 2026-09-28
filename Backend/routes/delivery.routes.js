import express from "express";

import { registerDeliveryAgent } from "../controllers/delivery/registerDeliveryAgent.controller.js";

import { uploadImage } from "../middleware/upload.middleware.js";
import { loginDeliveryAgent } from "../controllers/delivery/loginDeliveryAgent.controller.js";

import { deliveryAuthMiddleware } from "../middleware/deliveryAuth.middleware.js";
import { getDeliveryProfile } from "../controllers/delivery/getDeliveryProfile.controller.js";

import { updateDeliveryProfile } from "../controllers/delivery/updateDeliveryProfile.controller.js";

import { updateDeliveryStatus } from "../controllers/delivery/updateDeliveryStatus.controller.js";

const router = express.Router();

router.post(
  "/register",

  uploadImage("delivery-agents", "image"),

  registerDeliveryAgent,
);

router.post("/login", loginDeliveryAgent);

router.get("/profile", deliveryAuthMiddleware, getDeliveryProfile);

router.patch(
  "/profile",

  deliveryAuthMiddleware,

  uploadImage("delivery-agents", "image"),

  updateDeliveryProfile,
);

router.patch("/status", deliveryAuthMiddleware, updateDeliveryStatus);

export default router;
