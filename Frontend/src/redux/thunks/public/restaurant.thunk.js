import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRestaurantsService,
  getRestaurantBySlugService,
} from "../../../services/public/restaurant.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load restaurants"
  );
};

// =========================
// GET ALL RESTAURANTS
// HOME / LIST PAGE
// =========================

export const getRestaurants = createAsyncThunk(
  "publicRestaurant/getRestaurants",

  async (payload = {}, { rejectWithValue }) => {
    try {
      return await getRestaurantsService(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// GET RESTAURANT BY SLUG
// DETAILS PAGE
// =========================

export const getRestaurantBySlug = createAsyncThunk(
  "publicRestaurant/getRestaurantBySlug",

  async (slug, { rejectWithValue }) => {
    try {
      return await getRestaurantBySlugService(slug);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
