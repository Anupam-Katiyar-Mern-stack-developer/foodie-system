import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRestaurantProfileService,
  updateRestaurantProfileService,
  updateRestaurantStatusService,
} from "../../../services/restaurant/restaurantProfile.service";

// =============================
// ERROR HELPER
// =============================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =============================
// GET PROFILE
// =============================

export const getRestaurantProfile = createAsyncThunk(
  "restaurantProfile/getRestaurantProfile",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getRestaurantProfileService();

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// UPDATE PROFILE
// =============================

export const updateRestaurantProfile = createAsyncThunk(
  "restaurantProfile/updateRestaurantProfile",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateRestaurantProfileService(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// RESTAURANT OPEN / CLOSE
// =============================

export const updateRestaurantOpenStatus = createAsyncThunk(
  "restaurantProfile/updateOpenStatus",

  async (isOpen, { rejectWithValue }) => {
    try {
      return await updateRestaurantStatusService(isOpen);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
