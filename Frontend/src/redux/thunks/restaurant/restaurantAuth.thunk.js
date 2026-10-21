import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  loginRestaurantService,
  registerRestaurantService,
} from "../../../services/restaurant/restaurantAuth.service";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

// =========================================
// HELPER
// =========================================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

// =========================================
// REGISTER
// =========================================

export const registerRestaurant = createAsyncThunk(
  "restaurantAuth/registerRestaurant",

  async (payload, { rejectWithValue }) => {
    try {
      return await registerRestaurantService(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// LOGIN
// =========================================

export const loginRestaurant = createAsyncThunk(
  "restaurantAuth/loginRestaurant",

  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginRestaurantService(payload);

      /*
          IMPORTANT:

          Abhi hum assume kar rahe hain:

          {
            token: "...",
            restaurant: {...}
          }

          Agar backend response:
          {
            data: {
              token: "...",
              restaurant: {...}
            }
          }

          hua to backend response dekhkar
          yahan ek line adjust karenge.
        */

      const token = data?.token || data?.data?.token;

      if (token) {
        localStorage.setItem(
          STORAGE_KEYS.RESTAURANT_TOKEN,

          token,
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
