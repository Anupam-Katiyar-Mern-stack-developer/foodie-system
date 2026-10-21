import { createAsyncThunk } from "@reduxjs/toolkit";

import { getDeliveryHistoryService } from "../../../services/deliveryAgent/deliveryHistory.service";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export const getDeliveryHistory = createAsyncThunk(
  "deliveryHistory/getDeliveryHistory",

  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const response = await getDeliveryHistoryService(params, signal);

      return response?.data || response;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load delivery history");

      if (!signal.aborted) showErrorToast(message);

      return rejectWithValue(message);
    }
  }
);
