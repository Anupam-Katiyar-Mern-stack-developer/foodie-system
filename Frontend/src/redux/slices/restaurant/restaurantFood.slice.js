import { createSlice } from "@reduxjs/toolkit";

import {
  createFood,
  deleteFood,
  getMyFoods,
  toggleAvailability,
  updateFood,
} from "../../thunks/restaurant/restaurantFood.thunk";

const initialState = {
  foods: [],

  fetchLoading: false,

  createLoading: false,

  updateLoading: false,

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
    // =====================
    // GET
    // =====================

    builder
      .addCase(getMyFoods.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getMyFoods.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.foods = action.payload;

        state.error = null;
      })

      .addCase(getMyFoods.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload;
      });

    // =====================
    // CREATE
    // =====================

    builder
      .addCase(createFood.pending, (state) => {
        state.createLoading = true;

        state.error = null;
      })

      .addCase(createFood.fulfilled, (state, action) => {
        state.createLoading = false;

        if (action.payload) {
          state.foods.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createFood.rejected, (state, action) => {
        state.createLoading = false;

        state.error = action.payload;
      });

    // =====================
    // UPDATE
    // =====================

    builder
      .addCase(updateFood.pending, (state) => {
        state.updateLoading = true;

        state.error = null;
      })

      .addCase(updateFood.fulfilled, (state, action) => {
        state.updateLoading = false;

        const { originalSlug, food } = action.payload;

        const index = state.foods.findIndex(
          (item) => item.slug === originalSlug,
        );

        if (index !== -1 && food) {
          state.foods[index] = {
            ...state.foods[index],

            ...food,
          };
        }

        state.error = null;
      })

      .addCase(updateFood.rejected, (state, action) => {
        state.updateLoading = false;

        state.error = action.payload;
      });

    // =====================
    // DELETE
    // =====================

    builder
      .addCase(deleteFood.pending, (state, action) => {
        state.deletingSlug = action.meta.arg;

        state.error = null;
      })

      .addCase(deleteFood.fulfilled, (state, action) => {
        state.deletingSlug = null;

        state.foods = state.foods.filter(
          (food) => food.slug !== action.payload,
        );
      })

      .addCase(deleteFood.rejected, (state, action) => {
        state.deletingSlug = null;

        state.error = action.payload;
      });

    // =====================
    // AVAILABILITY
    // =====================

    builder
      .addCase(toggleAvailability.pending, (state, action) => {
        state.togglingSlug = action.meta.arg.foodSlug;

        state.error = null;
      })

      .addCase(toggleAvailability.fulfilled, (state, action) => {
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
      })

      .addCase(toggleAvailability.rejected, (state, action) => {
        state.togglingSlug = null;

        state.error = action.payload;
      });
  },
});

export const { clearRestaurantFoodError } = restaurantFoodSlice.actions;

export default restaurantFoodSlice.reducer;
