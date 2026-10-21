import { createSlice } from "@reduxjs/toolkit";
import {
  getFoods,
  getRestaurantFoods,
  getFoodBySlug,
} from "../../thunks/public/food.thunk";

const initialState = {
  foods: [],

  fetchLoading: false,
  error: null,

  restaurantFoods: [],
  restaurantFoodsLoading: false,
  restaurantFoodsError: null,

  selectedFood: null,
  detailLoading: false,
  detailError: null,
};

const foodSlice = createSlice({
  name: "publicFood",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getRestaurantFoods.pending, (state) => {
        state.restaurantFoodsLoading = true;

        state.restaurantFoodsError = null;
      })

      .addCase(getRestaurantFoods.fulfilled, (state, action) => {
        state.restaurantFoodsLoading = false;

        state.restaurantFoods = action.payload?.foods ?? [];

        state.restaurantPagination = action.payload?.pagination ?? null;
      })

      .addCase(getRestaurantFoods.rejected, (state, action) => {
        state.restaurantFoodsLoading = false;

        state.restaurantFoodsError = action.payload;

        state.restaurantFoods = [];
      });

    builder
      .addCase(getFoods.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getFoods.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.foods = action.payload?.foods ?? action.payload ?? [];
      })

      .addCase(getFoods.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload;

        state.foods = [];
      });

    builder
      .addCase(getFoodBySlug.pending, (state) => {
        state.detailLoading = true;

        state.detailError = null;

        state.selectedFood = null;
      })

      .addCase(getFoodBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;

        state.selectedFood = action.payload?.food ?? action.payload ?? null;
      })

      .addCase(getFoodBySlug.rejected, (state, action) => {
        state.detailLoading = false;

        state.detailError = action.payload;

        state.selectedFood = null;
      });
  },
});

export default foodSlice.reducer;
