import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createFoodService,
  deleteFoodService,
  getMyFoodsService,
  toggleFoodAvailabilityService,
  updateFoodService,
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
// CREATE FOOD
// =============================

export const createFood = createAsyncThunk(
  "restaurantFood/createFood",

  async (formData, { rejectWithValue }) => {
    try {
      const data = await createFoodService(formData);

      return data?.food || data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// UPDATE FOOD
// =============================

export const updateFood = createAsyncThunk(
  "restaurantFood/updateFood",

  async ({ foodSlug, formData }, { rejectWithValue }) => {
    try {
      const data = await updateFoodService({
        foodSlug,
        formData,
      });

      return {
        originalSlug: foodSlug,

        food: data?.food || data,
      };
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
