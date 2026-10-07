import { createSlice } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

import {
  loginRestaurant,
  registerRestaurant,
} from "../../thunks/restaurant/restaurantAuth.thunk";

const restaurantToken = localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN);

const initialState = {
  restaurant: null,

  isAuthenticated: Boolean(restaurantToken),

  registerLoading: false,

  loginLoading: false,

  error: null,

  registrationSuccess: false,
};

// =========================================
// SLICE
// =========================================

const restaurantAuthSlice = createSlice({
  name: "restaurantAuth",

  initialState,

  reducers: {
    clearRestaurantAuthError: (state) => {
      state.error = null;
    },

    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },

    logoutRestaurant: (state) => {
      localStorage.removeItem(STORAGE_KEYS.RESTAURANT_TOKEN);

      state.restaurant = null;

      state.isAuthenticated = false;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // REGISTER
    // =========================

    builder
      .addCase(
        registerRestaurant.pending,

        (state) => {
          state.registerLoading = true;

          state.error = null;

          state.registrationSuccess = false;
        },
      )

      .addCase(
        registerRestaurant.fulfilled,

        (state) => {
          state.registerLoading = false;

          state.registrationSuccess = true;

          state.error = null;
        },
      )

      .addCase(
        registerRestaurant.rejected,

        (state, action) => {
          state.registerLoading = false;

          state.registrationSuccess = false;

          state.error = action.payload;
        },
      );

    // =========================
    // LOGIN
    // =========================

    builder
      .addCase(
        loginRestaurant.pending,

        (state) => {
          state.loginLoading = true;

          state.error = null;
        },
      )

      .addCase(
        loginRestaurant.fulfilled,

        (state, action) => {
          state.loginLoading = false;

          state.error = null;

          const payload = action.payload;

          state.restaurant =
            payload?.restaurant || payload?.data?.restaurant || null;

          const token = payload?.token || payload?.data?.token;

          state.isAuthenticated = Boolean(token);
        },
      )

      .addCase(
        loginRestaurant.rejected,

        (state, action) => {
          state.loginLoading = false;

          state.error = action.payload;

          state.isAuthenticated = false;
        },
      );
  },
});

export const {
  clearRestaurantAuthError,
  clearRegistrationSuccess,
  logoutRestaurant,
} = restaurantAuthSlice.actions;

export default restaurantAuthSlice.reducer;
