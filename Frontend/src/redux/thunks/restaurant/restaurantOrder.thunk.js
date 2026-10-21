import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRestaurantOrdersService,
  getRestaurantOrderService,
  acceptRestaurantOrderService,
  rejectRestaurantOrderService,
  markOrderPreparingService,
  markOrderReadyService,
  getAvailableDeliveryAgentsService,
  sendRestaurantDeliveryOfferService,
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

  async (params, { rejectWithValue, signal }) => {
    try {
      const response = await getRestaurantOrdersService({ ...params, signal });
      return { orders: response.data, pagination: response.pagination };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
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
  }
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
  }
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
  }
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
  }
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
  }
);

// =========================================
// GET AVAILABLE DELIVERY AGENTS
// =========================================

export const getAvailableDeliveryAgents = createAsyncThunk(
  "restaurantOrder/getAvailableDeliveryAgents",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getAvailableDeliveryAgentsService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch delivery partners"
      );
    }
  }
);

// =========================================
// SEND DELIVERY OFFER
// =========================================

export const sendRestaurantDeliveryOffer = createAsyncThunk(
  "restaurantOrder/sendDeliveryOffer",

  async ({ orderNumber, deliveryAgentPublicId }, { rejectWithValue }) => {
    try {
      const response = await sendRestaurantDeliveryOfferService({
        orderNumber,
        deliveryAgentPublicId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send delivery offer"
      );
    }
  }
);
