import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyOrdersService,
  placeOrderService,
} from "../../../services/public/order.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";

import { showErrorToast, showSuccessToast } from "../../../utils/toast";

// const getErrorMessage = (error) => {
//   return (
//     error?.response?.data?.message || error?.message || "Something went wrong"
//   );
// };

// =========================
// GET MY ORDERS
// =========================

export const getMyOrders = createAsyncThunk(
  "publicOrder/getMyOrders",

  async (_, { rejectWithValue }) => {
    try {
      return await getMyOrdersService();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// PLACE ORDER
// =========================

export const placeOrder = createAsyncThunk(
  "publicOrder/placeOrder",

  async (payload, { rejectWithValue }) => {
    try {
      showSuccessToast("Order placed successfully");

      return await placeOrderService(payload);
    } catch (error) {
      const message = getErrorMessage(error, "Unable to place order");

      showErrorToast(message);
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
