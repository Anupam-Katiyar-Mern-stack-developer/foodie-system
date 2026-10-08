import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRestaurantOrdersService,
  getRestaurantOrderService,
  acceptRestaurantOrderService,
  rejectRestaurantOrderService,
  markOrderPreparingService,
  markOrderReadyService,
} from "../../../services/restaurant/restaurantOrder.service";

// =========================================
// ERROR
// =========================================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =========================================
// GET ORDERS
// =========================================

export const getRestaurantOrders = createAsyncThunk(
  "restaurantOrder/getOrders",

  async (params, { rejectWithValue }) => {
    try {
      const response = await getRestaurantOrdersService(params);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// GET SINGLE ORDER
// =========================================

export const getRestaurantOrder = createAsyncThunk(
  "restaurantOrder/getOrder",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getRestaurantOrderService(orderNumber);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// ACCEPT ORDER
// =========================================

export const acceptRestaurantOrder = createAsyncThunk(
  "restaurantOrder/accept",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await acceptRestaurantOrderService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// REJECT ORDER
// =========================================

export const rejectRestaurantOrder = createAsyncThunk(
  "restaurantOrder/reject",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await rejectRestaurantOrderService(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// PREPARING
// =========================================

export const markRestaurantOrderPreparing = createAsyncThunk(
  "restaurantOrder/preparing",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await markOrderPreparingService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// READY
// =========================================

export const markRestaurantOrderReady = createAsyncThunk(
  "restaurantOrder/ready",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await markOrderReadyService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
