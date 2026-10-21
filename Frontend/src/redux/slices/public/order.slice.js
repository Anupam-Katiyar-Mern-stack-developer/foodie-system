import { createSlice } from "@reduxjs/toolkit";

import { getMyOrders, placeOrder } from "../../thunks/public/order.thunk";

const initialState = {
  orders: [],

  fetchLoading: false,

  placeOrderLoading: false,

  error: null,

  placeOrderError: null,

  placeOrderSuccess: false,
};

const orderSlice = createSlice({
  name: "publicOrder",

  initialState,

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET MY ORDERS
      // =========================

      .addCase(getMyOrders.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.fetchLoading = false;

        /*
              Backend response possible:

              data: {
                orders: [...]
              }

              OR

              data: [...]
            */

        state.orders = action.payload?.orders ?? action.payload ?? [];
      })

      .addCase(getMyOrders.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload;
      });

    // =========================
    // PLACE ORDER
    // =========================
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placeOrderLoading = true;

        state.placeOrderError = null;

        state.placeOrderSuccess = false;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeOrderLoading = false;

        state.placeOrderSuccess = true;

        state.placeOrderError = null;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrderLoading = false;

        state.placeOrderSuccess = false;

        state.placeOrderError = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
