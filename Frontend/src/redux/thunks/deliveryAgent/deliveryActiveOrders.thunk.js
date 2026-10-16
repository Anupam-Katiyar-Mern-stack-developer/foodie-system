import { getActiveOrdersService } from "../../../services/deliveryAgent/deliveryActive.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showErrorToast } from "../../../utils/toast";

export const activeOrders = createAsyncThunk(
  "/deliveryActiveorders/activeOrders",
  async (_, { rejectwithValue }) => {
    try {
      const response = await getActiveOrdersService();
      response?.data || response;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load delivery dashboard",
      );
      showErrorToast(message);

      return rejectwithValue(message);
    }
  },
);
