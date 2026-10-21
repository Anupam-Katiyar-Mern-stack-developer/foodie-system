import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDeliveryProfileService,
  updateDeliveryProfileService,
  updateDeliveryOnlineStatusService,
} from "../../../services/deliveryAgent/deliveryProfile.service";

// =========================================
// ERROR HELPER
// =========================================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =========================================
// GET DELIVERY PROFILE
// =========================================

export const getDeliveryProfile = createAsyncThunk(
  "deliveryProfile/getProfile",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveryProfileService();

      console.log("GET DELIVERY PROFILE:", response);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// UPDATE DELIVERY PROFILE
// =========================================

export const updateDeliveryProfile = createAsyncThunk(
  "deliveryProfile/updateProfile",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateDeliveryProfileService(formData);

      console.log("UPDATE DELIVERY PROFILE:", response);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// UPDATE ONLINE STATUS
// =========================================

export const updateDeliveryOnlineStatus = createAsyncThunk(
  "deliveryProfile/updateOnlineStatus",

  async (isOnline, { rejectWithValue }) => {
    try {
      const response = await updateDeliveryOnlineStatusService(isOnline);

      console.log("DELIVERY ONLINE STATUS:", response);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
