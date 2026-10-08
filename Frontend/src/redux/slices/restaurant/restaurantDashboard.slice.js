import { createSlice } from "@reduxjs/toolkit";

import { getRestaurantDashboard } from "../../thunks/restaurant/restaurantDashboard.thunk";

const initialState = {
  restaurant: null,

  stats: {
    todayOrders: 0,

    todayNewOrders: 0,

    activeOrders: 0,

    activeFoods: 0,

    totalFoods: 0,

    revenue: null,

    revenueAvailable: false,
  },

  pipeline: {
    placed: 0,

    confirmed: 0,

    preparing: 0,

    readyForPickup: 0,
  },

  recentOrders: [],

  loading: false,

  error: null,
};

const restaurantDashboardSlice = createSlice({
  name: "restaurantDashboard",

  initialState,

  reducers: {
    clearRestaurantDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================
      // LOADING
      // =====================

      .addCase(
        getRestaurantDashboard.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      // =====================
      // SUCCESS
      // =====================

      .addCase(
        getRestaurantDashboard.fulfilled,

        (state, action) => {
          state.loading = false;

          state.restaurant = action.payload?.restaurant || null;

          state.stats = {
            ...state.stats,

            ...action.payload?.stats,
          };

          state.pipeline = {
            ...state.pipeline,

            ...action.payload?.pipeline,
          };

          state.recentOrders = action.payload?.recentOrders || [];

          state.error = null;
        },
      )

      // =====================
      // ERROR
      // =====================

      .addCase(
        getRestaurantDashboard.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        },
      );
  },
});

export const { clearRestaurantDashboardError } =
  restaurantDashboardSlice.actions;

export default restaurantDashboardSlice.reducer;
