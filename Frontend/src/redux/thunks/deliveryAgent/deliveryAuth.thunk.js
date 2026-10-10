import { createAsyncThunk } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

import {
  loginDeliveryAgentService,
  registerDeliveryAgentService,
} from "../../../services/deliveryAgent/deliveryAuth.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";

import {
  showErrorToast,
  showSuccessToast,
} from "../../../utils/toast";

// =========================================
// REGISTER
// =========================================

export const registerDeliveryAgent = createAsyncThunk(
  "deliveryAuth/registerDeliveryAgent",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerDeliveryAgentService(payload);

      showSuccessToast(
        response?.message || "Delivery partner registered successfully",
      );

      return response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to register delivery partner",
      );

      showErrorToast(message);

      return rejectWithValue(message);
    }
  },
);

// =========================================
// LOGIN
// =========================================

export const loginDeliveryAgent = createAsyncThunk(
  "deliveryAuth/loginDeliveryAgent",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginDeliveryAgentService(payload);

      const data = response?.data || response;

      const token =
        data?.token ||
        data?.deliveryToken ||
        response?.token ||
        response?.deliveryToken;

      if (!token) {
        const message = "Delivery login token not received";

        showErrorToast(message);

        return rejectWithValue(message);
      }

      localStorage.setItem(STORAGE_KEYS.DELIVERY_TOKEN, token);

      const deliveryAgent =
        data?.deliveryAgent || data?.agent || data?.user || null;

      showSuccessToast(response?.message || "Login successful");

      return {
        token,
        deliveryAgent,
      };
    } catch (error) {
      const message = getErrorMessage(error, "Unable to login");

      showErrorToast(message);

      return rejectWithValue(message);
    }
  },
);