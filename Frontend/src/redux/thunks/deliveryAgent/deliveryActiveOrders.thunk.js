import { createAsyncThunk } from "@reduxjs/toolkit";

import { getActiveOrderService } from "../../../services/deliveryAgent/deliveryActive.service";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showErrorToast } from "../../../utils/toast";

export const getActiveOrder = createAsyncThunk(
  "deliveryActive/getActiveOrder",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getActiveOrderService();

      // Axios response / response.data / direct data
      // tino cases safely handle karega.
      return response?.data?.data ?? response?.data ?? response ?? null;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load active delivery");

      showErrorToast(message);
      return rejectWithValue(message);
    }
  },
);
