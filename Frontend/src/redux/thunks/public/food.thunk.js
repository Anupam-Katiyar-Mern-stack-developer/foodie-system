import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFoodsService,
  getRestaurantFoodsService,
  getFoodBySlugService,
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

export const getFoodBySlug = createAsyncThunk(
  "publicFood/getFoodBySlug",

  async (foodSlug, { rejectWithValue }) => {
    try {
      return await getFoodBySlugService(foodSlug);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
