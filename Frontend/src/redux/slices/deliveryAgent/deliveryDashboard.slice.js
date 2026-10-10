import { createSlice } from "@reduxjs/toolkit";

import { getDeliveryDashboard } from "../../thunks/deliveryAgent/deliveryDashboard.thunk";

const initialState = {
  isOnline: false,

  stats: {
    todayDeliveries: 0,
    activeDelivery: 0,
    completedToday: 0,
    todayEarnings: 0,
  },

  currentDelivery: null,

  recentDeliveries: [],

  fetchLoading: false,

  error: null,
};

const deliveryDashboardSlice = createSlice({
  name: "deliveryDashboard",

  initialState,

  reducers: {
    clearDeliveryDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // =========================
      // GET DASHBOARD
      // =========================

      .addCase(getDeliveryDashboard.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(getDeliveryDashboard.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.isOnline = Boolean(action.payload?.isOnline);

        state.stats = {
          todayDeliveries: action.payload?.stats?.todayDeliveries || 0,

          activeDelivery: action.payload?.stats?.activeDelivery || 0,

          completedToday: action.payload?.stats?.completedToday || 0,

          todayEarnings: action.payload?.stats?.todayEarnings || 0,
        };

        state.currentDelivery = action.payload?.currentDelivery || null;

        state.recentDeliveries = action.payload?.recentDeliveries || [];

        state.error = null;
      })

      .addCase(getDeliveryDashboard.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload || "Unable to load delivery dashboard";
      });
  },
});

export const { clearDeliveryDashboardError } = deliveryDashboardSlice.actions;

export default deliveryDashboardSlice.reducer;
