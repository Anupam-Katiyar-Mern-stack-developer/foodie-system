import { createSlice } from "@reduxjs/toolkit";

import {
  getRestaurantProfile,
  updateRestaurantProfile,
  updateRestaurantOpenStatus,
} from "../../thunks/restaurant/restaurantProfile.thunk";

const initialState = {
  profile: null,

  fetchLoading: false,

  updateLoading: false,

  statusLoading: false,

  error: null,
};

// =============================
// SLICE
// =============================

const restaurantProfileSlice = createSlice({
  name: "restaurantProfile",

  initialState,

  reducers: {
    clearRestaurantProfileError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =====================
    // GET PROFILE
    // =====================

    builder
      .addCase(
        getRestaurantProfile.pending,

        (state) => {
          state.fetchLoading = true;

          state.error = null;
        },
      )

      .addCase(
        getRestaurantProfile.fulfilled,

        (state, action) => {
          state.fetchLoading = false;

          state.profile = action.payload;

          state.error = null;
        },
      )

      .addCase(
        getRestaurantProfile.rejected,

        (state, action) => {
          state.fetchLoading = false;

          state.error = action.payload;
        },
      );

    // =====================
    // UPDATE PROFILE
    // =====================

    builder
      .addCase(
        updateRestaurantProfile.pending,

        (state) => {
          state.updateLoading = true;

          state.error = null;
        },
      )

      .addCase(
        updateRestaurantProfile.fulfilled,

        (state, action) => {
          state.updateLoading = false;

          state.profile = action.payload;

          state.error = null;
        },
      )

      .addCase(
        updateRestaurantProfile.rejected,

        (state, action) => {
          state.updateLoading = false;

          state.error = action.payload;
        },
      );

    // =========================
    // OPEN / CLOSE STATUS
    // =========================

    builder
      .addCase(
        updateRestaurantOpenStatus.pending,

        (state) => {
          state.statusLoading = true;

          state.error = null;
        },
      )

      .addCase(
        updateRestaurantOpenStatus.fulfilled,

        (state, action) => {
          state.statusLoading = false;

          state.error = null;

          if (state.profile) {
            state.profile = {
              ...state.profile,
              ...action.payload,
            };
          }
        },
      )

      .addCase(
        updateRestaurantOpenStatus.rejected,

        (state, action) => {
          state.statusLoading = false;

          state.error = action.payload;
        },
      );
  },
});

export const { clearRestaurantProfileError } = restaurantProfileSlice.actions;

export default restaurantProfileSlice.reducer;
