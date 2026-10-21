import { createSlice } from "@reduxjs/toolkit";
import { syncRestaurantLocation } from "../../thunks/restaurant/restaurantLocation.thunk";

const initialState = {
  location: null,
  loading: false,
  error: null,
};

const restaurantLocationSlice = createSlice({
  name: "restaurantLocation",

  initialState,

  reducers: {
    clearRestaurantLocationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(syncRestaurantLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(syncRestaurantLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action.payload;
      })

      .addCase(syncRestaurantLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update restaurant location";
      });
  },
});

export const { clearRestaurantLocationError } = restaurantLocationSlice.actions;

export default restaurantLocationSlice.reducer;
