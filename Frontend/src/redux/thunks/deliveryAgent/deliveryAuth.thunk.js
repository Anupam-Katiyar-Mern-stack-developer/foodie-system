import { createAsyncThunk } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

import {
  loginDeliveryAgentService,
  registerDeliveryAgentService,
} from "../../../services/deliveryAgent/deliveryAuth.service";

// =========================================
// ERROR
// =========================================

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

// =========================================
// REGISTER
// =========================================

export const registerDeliveryAgent = createAsyncThunk(
  "deliveryAuth/registerDeliveryAgent",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerDeliveryAgentService(payload);

      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to register delivery partner"),
      );
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

      /*
       * Backend response thoda
       * nested ho tab bhi token
       * handle ho jayega.
       */

      const data = response?.data || response;

      const token =
        response?.token ||
        response?.deliveryToken ||
        data?.token ||
        data?.deliveryToken;

      if (!token) {
        return rejectWithValue("Delivery login token not received");
      }

      localStorage.setItem(
        STORAGE_KEYS.DELIVERY_TOKEN,

        token,
      );

      const deliveryAgent =
        data?.deliveryAgent || data?.agent || data?.user || null;

      return {
        token,
        deliveryAgent,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to login"));
    }
  },
);
