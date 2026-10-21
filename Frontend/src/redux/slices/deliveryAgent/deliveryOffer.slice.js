import { createSlice } from "@reduxjs/toolkit";

import {
  getDeliveryOffer,
  acceptDeliveryOffer,
  rejectDeliveryOffer,
} from "../../thunks/deliveryAgent/deliveryOffer.thunk";

const initialState = {
  offers: [],
  fetchLoading: false,
  actionLoading: false,
  actionOrderNumber: null,
  error: null,
  actionError: null,
};

const deliveryOfferSlice = createSlice({
  name: "deliveryOffer",

  initialState,

  reducers: {
    clearDeliveryOfferError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET DELIVERY OFFER
      // =========================

      .addCase(getDeliveryOffer.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(getDeliveryOffer.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.error = null;
        

        // Thunk already direct offer object return kar raha hai
        const offer = action.payload || null;

        state.offers = offer ? [offer] : [];
      })

      .addCase(getDeliveryOffer.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch delivery offer";
        state.offers = [];
      })

      // =========================
      // ACCEPT OFFER
      // =========================

      .addCase(acceptDeliveryOffer.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionOrderNumber = action.meta.arg;
      })

      .addCase(acceptDeliveryOffer.fulfilled, (state) => {
        state.actionLoading = false;
        state.actionError = null;
        state.actionOrderNumber = null;

        // Accept hone ke baad current offer remove
        state.offers = [];
      })

      .addCase(acceptDeliveryOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionOrderNumber = null;
        state.actionError =
          action.payload || "Failed to accept delivery offer";
      })

      // =========================
      // REJECT OFFER
      // =========================

      .addCase(rejectDeliveryOffer.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionOrderNumber = action.meta.arg;
      })

      .addCase(rejectDeliveryOffer.fulfilled, (state) => {
        state.actionLoading = false;
        state.actionError = null;
        state.actionOrderNumber = null;

        // Reject ke baad old offer hatao.
        // UI already getDeliveryOffer() dobara dispatch kar rahi hai.
        state.offers = [];
      })

      .addCase(rejectDeliveryOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionOrderNumber = null;
        state.actionError =
          action.payload || "Failed to reject delivery offer";
      });
  },
});

export const { clearDeliveryOfferError } =
  deliveryOfferSlice.actions;

export default deliveryOfferSlice.reducer;