import { createSlice } from "@reduxjs/toolkit";

import {
  completeDelivery,
  getActiveDelivery,
  pickupDelivery,
  startDelivery,
} from "../../thunks/deliveryAgent/deliveryActiveOrders.thunk";

const initialState = {
  delivery: null,

  fetchLoading: false,
  actionLoading: false,
  actionType: null,

  error: null,
  actionError: null,

  otpSent: false,
  otpExpiresAt: null,
};

const deliveryActiveSlice = createSlice({
  name: "deliveryActive",

  initialState,

  reducers: {
    clearDeliveryActionError: (state) => {
      state.actionError = null;
    },

    clearActiveDelivery: (state) => {
      state.delivery = null;
      state.otpSent = false;
      state.otpExpiresAt = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getActiveDelivery.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(getActiveDelivery.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.error = null;
        state.delivery = action.payload;
      })

      .addCase(getActiveDelivery.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      })

      // PICKUP
      .addCase(pickupDelivery.pending, (state) => {
        state.actionLoading = true;
        state.actionType = "PICKUP";
        state.actionError = null;
      })

      .addCase(pickupDelivery.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionType = null;

        if (state.delivery && action.payload) {
          state.delivery = {
            ...state.delivery,
            ...action.payload,
          };
        }
      })

      .addCase(pickupDelivery.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionType = null;
        state.actionError = action.payload;
      })

      // START DELIVERY
      .addCase(startDelivery.pending, (state) => {
        state.actionLoading = true;
        state.actionType = "START";
        state.actionError = null;
      })

      .addCase(startDelivery.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionType = null;

        if (state.delivery && action.payload) {
          state.delivery = {
            ...state.delivery,
            ...action.payload,
          };
        }

        state.otpSent = Boolean(action.payload?.otpSent);
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
      })

      .addCase(startDelivery.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionType = null;
        state.actionError = action.payload;
      })

      // COMPLETE
      .addCase(completeDelivery.pending, (state) => {
        state.actionLoading = true;
        state.actionType = "COMPLETE";
        state.actionError = null;
      })

      .addCase(completeDelivery.fulfilled, (state) => {
        state.actionLoading = false;
        state.actionType = null;

        state.delivery = null;
        state.otpSent = false;
        state.otpExpiresAt = null;
        state.actionError = null;
      })

      .addCase(completeDelivery.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionType = null;
        state.actionError = action.payload;
      });
  },
});

export const { clearActiveDelivery, clearDeliveryActionError } =
  deliveryActiveSlice.actions;

export default deliveryActiveSlice.reducer;
