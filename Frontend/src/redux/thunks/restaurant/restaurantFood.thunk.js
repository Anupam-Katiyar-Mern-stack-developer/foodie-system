import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyFoodsService,
  deleteFoodService,
  toggleFoodAvailabilityService,
} from "../../../services/restaurant/restaurantFood.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =============================
// GET MY FOODS
// =============================

export const getMyFoods = createAsyncThunk(
  "restaurantFood/getMyFoods",

  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyFoodsService();

      if (Array.isArray(data)) {
        return data;
      }

      return data?.foods || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// DELETE FOOD
// =============================

export const deleteFood = createAsyncThunk(
  "restaurantFood/deleteFood",

  async (foodSlug, { rejectWithValue }) => {
    try {
      await deleteFoodService(foodSlug);

      return foodSlug;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// TOGGLE AVAILABILITY
// =============================

export const toggleAvailability = createAsyncThunk(
  "restaurantFood/toggleAvailability",

  async ({ foodSlug, isAvailable }, { rejectWithValue }) => {
    try {
      const data = await toggleFoodAvailabilityService({
        foodSlug,
        isAvailable,
      });

      return {
        foodSlug,

        isAvailable,

        updatedFood: data?.food || data || null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
