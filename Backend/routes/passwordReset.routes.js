// routes/passwordReset.routes.js

import express from "express";

import { forgotPassword } from "../controllers/auth/forgotPassword.controller.js";
import { resetPassword } from "../controllers/auth/resetPassword.controller.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
