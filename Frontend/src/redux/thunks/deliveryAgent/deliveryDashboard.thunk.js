import { createAsyncThunk } from "@reduxjs/toolkit";

import { getDeliveryDashboardService } from "../../../services/deliveryAgent/deliveryDashboard.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";

import { showErrorToast, showSuccessToast } from "../../../utils/toast";

// =========================================
// GET DASHBOARD
// =========================================

export const getDeliveryDashboard = createAsyncThunk(
  "deliveryDashboard/getDeliveryDashboard",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveryDashboardService();

      showSuccessToast(response?.message || "Dashboard loaded successfully");

      return response?.data || response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load delivery dashboard",
      );

      showErrorToast(message);

      return rejectWithValue(message);
    }
  },
);
