import { createSlice } from "@reduxjs/toolkit";

import {
  getDeliveryDashboard,
  getDeliveryEarnings,
} from "../../thunks/deliveryAgent/deliveryDashboard.thunk";

const initialState = {
  earnings: {
    entries: [],
    summary: {},
    weekly: [],
    pagination: {},
    loading: false,
    error: null,
  },
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
      .addCase(getDeliveryEarnings.pending, (state, action) => {
        state.earnings.loading = true;
        state.earnings.error = null;
        state.earnings.requestId = action.meta.requestId;
      })
      .addCase(getDeliveryEarnings.fulfilled, (state, action) => {
        if (state.earnings.requestId !== action.meta.requestId) return;
        state.earnings = {
          ...action.payload,
          loading: false,
          error: null,
          requestId: action.meta.requestId,
        };
      })
      .addCase(getDeliveryEarnings.rejected, (state, action) => {
        if (state.earnings.requestId !== action.meta.requestId) return;
        state.earnings.loading = false;
        if (!action.meta.aborted) state.earnings.error = action.payload;
      });

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
