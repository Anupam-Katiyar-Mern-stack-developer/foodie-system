import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { createAddress } from "../controllers/address/createAddress.controller.js";
import { getAddresses } from "../controllers/address/getAddresses.controller.js";
import { updateAddress } from "../controllers/address/updateAddress.controller.js";
import { deleteAddress } from "../controllers/address/deleteAddress.controller.js";
import { setDefaultAddress } from "../controllers/address/setDefaultAddress.controller.js";
const router = express.Router();

router.post("/", authMiddleware, createAddress);

router.get("/", authMiddleware, getAddresses);
router.put(
  "/:addressId",
  authMiddleware,
  updateAddress
);
router.delete(
  "/:addressId",
  authMiddleware,
  deleteAddress
);

router.patch(
  "/:addressId/default",
  authMiddleware,
  setDefaultAddress
);
export default router;
