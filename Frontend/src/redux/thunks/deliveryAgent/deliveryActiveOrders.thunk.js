import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  completeDeliveryService,
  getActiveDeliveryService,
  pickupDeliveryService,
  startDeliveryService,
} from "../../../services/deliveryAgent/deliveryActive.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export const getActiveDelivery = createAsyncThunk(
  "deliveryActive/getActiveDelivery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActiveDeliveryService();
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch active delivery"),
      );
    }
  },
);

export const pickupDelivery = createAsyncThunk(
  "deliveryActive/pickupDelivery",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await pickupDeliveryService(orderNumber);

      showSuccessToast(response?.message || "Order picked up successfully");

      return response?.data || null;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to confirm pickup");

      showErrorToast(message);
      return rejectWithValue(message);
    }
  },
);

export const startDelivery = createAsyncThunk(
  "deliveryActive/startDelivery",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await startDeliveryService(orderNumber);

      showSuccessToast(
        response?.data?.otpSent
          ? "Delivery started. OTP sent to customer."
          : "Delivery started successfully",
      );

      return response?.data || null;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to start delivery");

      showErrorToast(message);
      return rejectWithValue(message);
    }
  },
);

export const completeDelivery = createAsyncThunk(
  "deliveryActive/completeDelivery",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await completeDeliveryService(payload);

      showSuccessToast(response?.message || "Delivery completed successfully");

      return response?.data || null;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to complete delivery");

      showErrorToast(message);
      return rejectWithValue(message);
    }
  },
);
