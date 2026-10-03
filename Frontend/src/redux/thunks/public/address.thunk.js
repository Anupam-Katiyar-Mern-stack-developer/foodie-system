import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createAddressService,
  deleteAddressService,
  getAddressesService,
  setDefaultAddressService,
  updateAddressService,
} from "../../../services/public/address.service";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

// =========================
// GET
// =========================

export const getAddresses = createAsyncThunk(
  "publicAddress/getAddresses",

  async (_, { rejectWithValue }) => {
    try {
      return await getAddressesService();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// CREATE
// =========================

export const createAddress = createAsyncThunk(
  "publicAddress/createAddress",

  async (payload, { rejectWithValue }) => {
    try {
      return await createAddressService(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// UPDATE
// =========================

export const updateAddress = createAsyncThunk(
  "publicAddress/updateAddress",

  async (
    { addressId, payload },

    { rejectWithValue },
  ) => {
    try {
      return await updateAddressService(addressId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// DELETE
// =========================

export const deleteAddress = createAsyncThunk(
  "publicAddress/deleteAddress",

  async (
    addressId,

    { rejectWithValue },
  ) => {
    try {
      await deleteAddressService(addressId);

      return addressId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// DEFAULT
// =========================

export const setDefaultAddress = createAsyncThunk(
  "publicAddress/setDefaultAddress",

  async (
    addressId,

    { rejectWithValue },
  ) => {
    try {
      await setDefaultAddressService(addressId);

      return addressId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
