import { createSlice } from "@reduxjs/toolkit";
import { getDeliveryHistory } from "../../thunks/deliveryAgent/deliveryHistory.thunk";

const initialState = {
  deliveries: [],

  stats: {
    totalDeliveries: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0,
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  loading: false,
  error: null,
};

const deliveryHistorySlice = createSlice({
  name: "deliveryHistory",
  initialState,

  reducers: {
    clearDeliveryHistoryError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDeliveryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload?.deliveries || [];
        state.stats = action.payload?.stats || initialState.stats;
        state.pagination =
          action.payload?.pagination || initialState.pagination;
        state.error = null;
      })

      .addCase(getDeliveryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load delivery history";
      });
  },
});

export const { clearDeliveryHistoryError } = deliveryHistorySlice.actions;

export default deliveryHistorySlice.reducer;
