import { createSlice } from "@reduxjs/toolkit";

import {
  getRestaurantOrders,
  getRestaurantOrder,
  acceptRestaurantOrder,
  rejectRestaurantOrder,
  markRestaurantOrderPreparing,
  markRestaurantOrderReady,
} from "../../thunks/restaurant/restaurantOrder.thunk";

const initialState = {
  orders: [],

  selectedOrder: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  fetchLoading: false,

  detailLoading: false,

  actionLoading: false,

  actionOrderNumber: null,

  error: null,

  detailError: null,

  actionError: null,
};

// =========================================
// UPDATE ORDER HELPER
// =========================================

const updateOrderState = (state, updatedOrder) => {
  if (!updatedOrder?.orderNumber) {
    return;
  }

  const index = state.orders.findIndex(
    (order) => order.orderNumber === updatedOrder.orderNumber,
  );

  if (index !== -1) {
    state.orders[index] = {
      ...state.orders[index],
      ...updatedOrder,
    };
  }

  if (state.selectedOrder?.orderNumber === updatedOrder.orderNumber) {
    state.selectedOrder = {
      ...state.selectedOrder,
      ...updatedOrder,
    };
  }
};

// =========================================
// SLICE
// =========================================

const restaurantOrderSlice = createSlice({
  name: "restaurantOrder",

  initialState,

  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;

      state.detailError = null;
    },

    clearOrderError: (state) => {
      state.error = null;

      state.detailError = null;

      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    // =============================
    // ORDERS LIST
    // =============================

    builder
      .addCase(
        getRestaurantOrders.pending,

        (state) => {
          state.fetchLoading = true;

          state.error = null;
        },
      )

      .addCase(
        getRestaurantOrders.fulfilled,

        (state, action) => {
          state.fetchLoading = false;

          state.orders = action.payload?.orders || [];

          state.pagination =
            action.payload?.pagination || initialState.pagination;
        },
      )

      .addCase(
        getRestaurantOrders.rejected,

        (state, action) => {
          state.fetchLoading = false;

          state.error = action.payload;
        },
      );

    // =============================
    // SINGLE ORDER
    // =============================

    builder
      .addCase(
        getRestaurantOrder.pending,

        (state) => {
          state.detailLoading = true;

          state.detailError = null;
        },
      )

      .addCase(
        getRestaurantOrder.fulfilled,

        (state, action) => {
          state.detailLoading = false;

          state.selectedOrder = action.payload;
        },
      )

      .addCase(
        getRestaurantOrder.rejected,

        (state, action) => {
          state.detailLoading = false;

          state.detailError = action.payload;
        },
      );

    // =============================
    // ACTION PENDING
    // =============================

    builder.addMatcher(
      (action) =>
        [
          acceptRestaurantOrder.pending.type,
          rejectRestaurantOrder.pending.type,
          markRestaurantOrderPreparing.pending.type,
          markRestaurantOrderReady.pending.type,
        ].includes(action.type),

      (state, action) => {
        state.actionLoading = true;

        state.actionError = null;

        state.actionOrderNumber =
          action.meta.arg?.orderNumber || action.meta.arg || null;
      },
    );

    // =============================
    // ACTION SUCCESS
    // =============================

    builder.addMatcher(
      (action) =>
        [
          acceptRestaurantOrder.fulfilled.type,
          rejectRestaurantOrder.fulfilled.type,
          markRestaurantOrderPreparing.fulfilled.type,
          markRestaurantOrderReady.fulfilled.type,
        ].includes(action.type),

      (state, action) => {
        state.actionLoading = false;

        state.actionOrderNumber = null;

        updateOrderState(state, action.payload);
      },
    );

    // =============================
    // ACTION ERROR
    // =============================

    builder.addMatcher(
      (action) =>
        [
          acceptRestaurantOrder.rejected.type,
          rejectRestaurantOrder.rejected.type,
          markRestaurantOrderPreparing.rejected.type,
          markRestaurantOrderReady.rejected.type,
        ].includes(action.type),

      (state, action) => {
        state.actionLoading = false;

        state.actionOrderNumber = null;

        state.actionError = action.payload;
      },
    );
  },
});

export const { clearSelectedOrder, clearOrderError } =
  restaurantOrderSlice.actions;

export default restaurantOrderSlice.reducer;
