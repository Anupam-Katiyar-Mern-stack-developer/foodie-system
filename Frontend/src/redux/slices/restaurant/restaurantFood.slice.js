import { createSlice } from "@reduxjs/toolkit";

import {
  getMyFoods,
  deleteFood,
  toggleAvailability,
} from "../../thunks/restaurant/restaurantFood.thunk";

const initialState = {
  foods: [],

  fetchLoading: false,

  deletingSlug: null,

  togglingSlug: null,

  error: null,
};

const restaurantFoodSlice = createSlice({
  name: "restaurantFood",

  initialState,

  reducers: {
    clearRestaurantFoodError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // GET FOODS
    // =========================

    builder
      .addCase(
        getMyFoods.pending,

        (state) => {
          state.fetchLoading = true;

          state.error = null;
        },
      )

      .addCase(
        getMyFoods.fulfilled,

        (state, action) => {
          state.fetchLoading = false;

          state.foods = action.payload;

          state.error = null;
        },
      )

      .addCase(
        getMyFoods.rejected,

        (state, action) => {
          state.fetchLoading = false;

          state.error = action.payload;
        },
      );

    // =========================
    // DELETE
    // =========================

    builder
      .addCase(
        deleteFood.pending,

        (state, action) => {
          state.deletingSlug = action.meta.arg;

          state.error = null;
        },
      )

      .addCase(
        deleteFood.fulfilled,

        (state, action) => {
          state.deletingSlug = null;

          state.foods = state.foods.filter(
            (food) => food.slug !== action.payload,
          );

          state.error = null;
        },
      )

      .addCase(
        deleteFood.rejected,

        (state, action) => {
          state.deletingSlug = null;

          state.error = action.payload;
        },
      );

    // =========================
    // AVAILABILITY
    // =========================

    builder
      .addCase(
        toggleAvailability.pending,

        (state, action) => {
          state.togglingSlug = action.meta.arg.foodSlug;

          state.error = null;
        },
      )

      .addCase(
        toggleAvailability.fulfilled,

        (state, action) => {
          state.togglingSlug = null;

          const { foodSlug, isAvailable, updatedFood } = action.payload;

          const index = state.foods.findIndex((food) => food.slug === foodSlug);

          if (index === -1) {
            return;
          }

          if (updatedFood && updatedFood.slug) {
            state.foods[index] = {
              ...state.foods[index],

              ...updatedFood,
            };
          } else {
            state.foods[index].isAvailable = isAvailable;
          }

          state.error = null;
        },
      )

      .addCase(
        toggleAvailability.rejected,

        (state, action) => {
          state.togglingSlug = null;

          state.error = action.payload;
        },
      );
  },
});

export const { clearRestaurantFoodError } = restaurantFoodSlice.actions;

export default restaurantFoodSlice.reducer;
