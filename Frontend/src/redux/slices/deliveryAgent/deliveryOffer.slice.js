import { createSlice } from "@reduxjs/toolkit";

import {
  getDeliveryOffer,
  acceptDeliveryOffer,
  rejectDeliveryOffer,
} from "../../thunks/deliveryAgent/deliveryOffer.thunk";

// =========================================
// INITIAL STATE
// =========================================

const initialState = {
  offers: [],

  fetchLoading: false,

  actionLoading: false,

  actionOrderNumber: null,

  error: null,

  actionError: null,
};

// =========================================
// SLICE
// =========================================

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
    // =====================================
    // GET DELIVERY OFFER
    // =====================================

    builder

      .addCase(
        getDeliveryOffer.pending,

        (state) => {
          state.fetchLoading = true;

          state.error = null;
        },
      )

      .addCase(
        getDeliveryOffer.fulfilled,

        (state, action) => {
          state.fetchLoading = false;

          state.error = null;

          console.log("DELIVERY OFFER SLICE:", action.payload);

          /*
           * Backend:
           *
           * {
           *   success: true,
           *   message: "...",
           *   data: offer | null
           * }
           */

          const offer = action.payload?.data || null;

          state.offers = offer ? [offer] : [];
        },
      )

      .addCase(
        getDeliveryOffer.rejected,

        (state, action) => {
          state.fetchLoading = false;

          state.error = action.payload;

          state.offers = [];
        },
      );

    // =====================================
    // ACCEPT OFFER
    // =====================================

    builder

      .addCase(
        acceptDeliveryOffer.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg;
        },
      )

      .addCase(
        acceptDeliveryOffer.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionError = null;

          state.actionOrderNumber = null;

          const orderNumber = action.payload?.data?.orderNumber;

          state.offers = state.offers.filter(
            (offer) => offer.orderNumber !== orderNumber,
          );
        },
      )

      .addCase(
        acceptDeliveryOffer.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = action.payload;
        },
      );

    // =====================================
    // REJECT OFFER
    // =====================================

    builder

      .addCase(
        rejectDeliveryOffer.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg;
        },
      )

      .addCase(
        rejectDeliveryOffer.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionError = null;

          state.actionOrderNumber = null;

          /*
           * Backend reject response:
           *
           * data: {
           *   orderNumber,
           *   status,
           *   nextOffer
           * }
           */

          const nextOffer = action.payload?.data?.nextOffer || null;

          state.offers = nextOffer ? [nextOffer] : [];
        },
      )

      .addCase(
        rejectDeliveryOffer.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = action.payload;
        },
      );
  },
});

export const { clearDeliveryOfferError } = deliveryOfferSlice.actions;

export default deliveryOfferSlice.reducer;
