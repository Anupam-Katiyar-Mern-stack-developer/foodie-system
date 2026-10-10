import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDeliveryOfferService,
  acceptDeliveryOfferService,
  rejectDeliveryOfferService,
} from "../../../services/deliveryAgent/deliveryOffer.service";

// =========================================
// ERROR HELPER
// =========================================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =========================================
// GET OFFER
// =========================================

export const getDeliveryOffer = createAsyncThunk(
  "deliveryOffer/getOffer",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveryOfferService();

      console.log("DELIVERY OFFER THUNK:", response);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// ACCEPT
// =========================================

export const acceptDeliveryOffer = createAsyncThunk(
  "deliveryOffer/acceptOffer",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await acceptDeliveryOfferService(orderNumber);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================================
// REJECT
// =========================================

export const rejectDeliveryOffer = createAsyncThunk(
  "deliveryOffer/rejectOffer",

  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await rejectDeliveryOfferService(orderNumber);

      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
