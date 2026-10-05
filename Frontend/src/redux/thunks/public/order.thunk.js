import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getMyOrdersService,
  placeOrderService,
} from "../../../services/public/order.service";


const getErrorMessage = (
  error
) => {
  return (
    error?.response?.data
      ?.message ||
    error?.message ||
    "Something went wrong"
  );
};


// =========================
// GET MY ORDERS
// =========================

export const getMyOrders =
  createAsyncThunk(
    "publicOrder/getMyOrders",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getMyOrdersService();

      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error
          )
        );
      }
    }
  );


// =========================
// PLACE ORDER
// =========================

export const placeOrder =
  createAsyncThunk(
    "publicOrder/placeOrder",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await placeOrderService(
          payload
        );

      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error
          )
        );
      }
    }
  );