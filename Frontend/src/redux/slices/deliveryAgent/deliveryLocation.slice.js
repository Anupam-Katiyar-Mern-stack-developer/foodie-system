import { createSlice } from "@reduxjs/toolkit";
import { updateDeliveryLocation } from "../../thunks/deliveryAgent/deliveryLocation.thunk";

const initialState = {
  location: null,

  tracking: false,

  loading: false,

  error: null,
};

const deliveryLocationSlice = createSlice({
  name: "deliveryLocation",

  initialState,

  reducers: {
    setLocationError: (state, action) => {
      state.error = action.payload;
      state.tracking = false;
    },

    stopTracking: (state) => {
      state.tracking = false;
    },

    clearDeliveryLocationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateDeliveryLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateDeliveryLocation.fulfilled, (state, action) => {
        state.loading = false;

        state.tracking = true;

        state.location = action.payload;
      })

      .addCase(updateDeliveryLocation.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to update live location";
      });
  },
});

export const { setLocationError, stopTracking, clearDeliveryLocationError } =
  deliveryLocationSlice.actions;

export default deliveryLocationSlice.reducer;
