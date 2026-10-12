import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDeliveryOfferService,
  acceptDeliveryOfferService,
  rejectDeliveryOfferService,
} from "../../../services/deliveryAgent/deliveryOffer.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =============================
// GET DELIVERY OFFER
// =============================

export const getDeliveryOffer = createAsyncThunk(
  "deliveryOffer/get",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveryOfferService();

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// ACCEPT DELIVERY OFFER
// =============================

export const acceptDeliveryOffer = createAsyncThunk(
  "deliveryOffer/accept",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await acceptDeliveryOfferService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =============================
// REJECT DELIVERY OFFER
// =============================

export const rejectDeliveryOffer = createAsyncThunk(
  "deliveryOffer/reject",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await rejectDeliveryOfferService(orderNumber);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
