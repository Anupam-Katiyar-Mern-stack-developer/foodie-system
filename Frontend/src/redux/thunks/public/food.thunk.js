import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFoodsService,
  getRestaurantFoodsService,
} from "../../../services/public/food.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Unable to load foods"
  );
};

// =========================
// GET ALL FOODS
// HOME PAGE
// =========================

export const getFoods = createAsyncThunk(
  "publicFood/getFoods",

  async (payload = {}, { rejectWithValue }) => {
    try {
      const result = await getFoodsService(payload);

      return result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// GET RESTAURANT FOODS
// RESTAURANT DETAILS
// =========================

export const getRestaurantFoods = createAsyncThunk(
  "publicFood/getRestaurantFoods",

  async (payload, { rejectWithValue }) => {
    try {
      return await getRestaurantFoodsService(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
