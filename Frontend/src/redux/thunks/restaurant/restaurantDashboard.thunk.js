import { createAsyncThunk } from "@reduxjs/toolkit";

import { getRestaurantDashboardService } from "../../../services/restaurant/restaurantDashboard.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load dashboard"
  );
};

export const getRestaurantDashboard = createAsyncThunk(
  "restaurantDashboard/getRestaurantDashboard",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getRestaurantDashboardService();

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
