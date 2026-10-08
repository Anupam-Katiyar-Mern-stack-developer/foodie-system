import { createSlice } from "@reduxjs/toolkit";

import {
  getRestaurantOrders,
  getRestaurantOrder,
  acceptRestaurantOrder,
  rejectRestaurantOrder,
  markRestaurantOrderPreparing,
  markRestaurantOrderReady,
} from "../../thunks/restaurant/restaurantOrder.thunk";

// =========================================
// INITIAL STATE
// =========================================

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

const updateOrderInState = (state, updatedOrder) => {
  if (!updatedOrder || !updatedOrder.orderNumber) {
    return;
  }

  // Update order inside list
  const orderIndex = state.orders.findIndex(
    (order) => order.orderNumber === updatedOrder.orderNumber,
  );

  if (orderIndex !== -1) {
    state.orders[orderIndex] = {
      ...state.orders[orderIndex],

      ...updatedOrder,
    };
  }

  // Update order details
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
    // =========================
    // CLEAR SELECTED ORDER
    // =========================

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;

      state.detailError = null;
    },

    // =========================
    // CLEAR ERRORS
    // =========================

    clearOrderError: (state) => {
      state.error = null;

      state.detailError = null;

      state.actionError = null;
    },
  },

  // =========================================
  // EXTRA REDUCERS
  // =========================================

  extraReducers: (builder) => {
    // =====================================
    // GET RESTAURANT ORDERS
    // =====================================

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

          state.error = null;

          console.log("GET ORDERS PAYLOAD:", action.payload);

          // payload direct array aa raha hai
          if (Array.isArray(action.payload)) {
            state.orders = action.payload;

            state.pagination = {
              page: 1,
              limit: 10,
              total: action.payload.length,
              totalPages: 1,
            };

            return;
          }

          // future me object aaye to
          // ye bhi support karega
          state.orders = action.payload?.orders || [];

          state.pagination =
            action.payload?.pagination || initialState.pagination;
        },
      )

      .addCase(
        getRestaurantOrders.rejected,

        (state, action) => {
          state.fetchLoading = false;

          state.error = action.payload || "Unable to fetch orders";
        },
      );

    // =====================================
    // GET SINGLE RESTAURANT ORDER
    // =====================================

    builder

      .addCase(
        getRestaurantOrder.pending,

        (state) => {
          state.detailLoading = true;

          state.detailError = null;

          state.selectedOrder = null;
        },
      )

      .addCase(
        getRestaurantOrder.fulfilled,

        (state, action) => {
          state.detailLoading = false;

          state.detailError = null;

          console.log("SINGLE ORDER PAYLOAD:", action.payload);

          state.selectedOrder = action.payload;
        },
      )

      .addCase(
        getRestaurantOrder.rejected,

        (state, action) => {
          state.detailLoading = false;

          state.detailError = action.payload || "Unable to fetch order";
        },
      );

    // =====================================
    // ACCEPT ORDER
    // =====================================

    builder

      .addCase(
        acceptRestaurantOrder.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg;
        },
      )

      .addCase(
        acceptRestaurantOrder.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = null;

          console.log("ACCEPT ORDER:", action.payload);

          updateOrderInState(state, action.payload);
        },
      )

      .addCase(
        acceptRestaurantOrder.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = action.payload || "Unable to accept order";
        },
      );

    // =====================================
    // REJECT ORDER
    // =====================================

    builder

      .addCase(
        rejectRestaurantOrder.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg?.orderNumber || null;
        },
      )

      .addCase(
        rejectRestaurantOrder.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = null;

          console.log("REJECT ORDER:", action.payload);

          updateOrderInState(state, action.payload);
        },
      )

      .addCase(
        rejectRestaurantOrder.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = action.payload || "Unable to reject order";
        },
      );

    // =====================================
    // MARK PREPARING
    // =====================================

    builder

      .addCase(
        markRestaurantOrderPreparing.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg;
        },
      )

      .addCase(
        markRestaurantOrderPreparing.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = null;

          console.log("PREPARING ORDER:", action.payload);

          updateOrderInState(state, action.payload);
        },
      )

      .addCase(
        markRestaurantOrderPreparing.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError =
            action.payload || "Unable to move order to preparing";
        },
      );

    // =====================================
    // MARK READY
    // =====================================

    builder

      .addCase(
        markRestaurantOrderReady.pending,

        (state, action) => {
          state.actionLoading = true;

          state.actionError = null;

          state.actionOrderNumber = action.meta.arg;
        },
      )

      .addCase(
        markRestaurantOrderReady.fulfilled,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = null;

          console.log("READY ORDER:", action.payload);

          updateOrderInState(state, action.payload);
        },
      )

      .addCase(
        markRestaurantOrderReady.rejected,

        (state, action) => {
          state.actionLoading = false;

          state.actionOrderNumber = null;

          state.actionError = action.payload || "Unable to mark order ready";
        },
      );
  },
});

// =========================================
// ACTIONS
// =========================================

export const {
  clearSelectedOrder,

  clearOrderError,
} = restaurantOrderSlice.actions;

// =========================================
// REDUCER
// =========================================

export default restaurantOrderSlice.reducer;
