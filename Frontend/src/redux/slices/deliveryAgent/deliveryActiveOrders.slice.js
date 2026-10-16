import { createSlice } from "@reduxjs/toolkit";
import { getActiveOrder } from "../../thunks/deliveryAgent/deliveryActiveOrders.thunk";

const initialState = {
  activeOrder: null,
  fetchLoading: false,
  error: null,
};

const deliveryActiveOrderSlice = createSlice({
  name: "deliveryActiveOrder",
  initialState,
  reducers: {
    clearActiveOrder: (state) => {
      state.activeOrder = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getActiveOrder.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(getActiveOrder.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.error = null;
        state.activeOrder = action.payload;
      })

      .addCase(getActiveOrder.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch active delivery";
        state.activeOrder = null;
      });
  },
});

export const { clearActiveOrder } = deliveryActiveOrderSlice.actions;

export default deliveryActiveOrderSlice.reducer;
