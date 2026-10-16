import { createSlice } from "@reduxjs/toolkit";

import { deliveryActiveOrders } from "../../thunks/deliveryAgent/deliveryActiveOrders.thunk";

const initialState = {
  ActiveOrder: [],
  fetchLoading: false,
  error: false,
};

const deliveryActiveOrder = createSlice({
  name: "deliveryActiveOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deliveryActiveOrder.pending, (state) => {
        state.fetchLoading = false;
        state.error = null;
      })

      .addCase(deliveryActiveOrder.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.error = null;
        state.ActiveOrder = action.payload || [];
      })

      .addCase(deliveryActiveOrders.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "failed to fetch delivery active order";
        state.ActiveOrder = [];
      });
  },
});
