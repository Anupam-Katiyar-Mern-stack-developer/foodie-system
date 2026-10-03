import { createSlice } from "@reduxjs/toolkit";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../thunks/public/address.thunk";

const initialState = {
  addresses: [],

  fetchLoading: false,
  createLoading: false,
  updateLoading: false,

  deletingId: null,

  defaultLoadingId: null,

  error: null,
};

const addressSlice = createSlice({
  name: "publicAddress",

  initialState,

  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =====================
    // GET
    // =====================

    builder
      .addCase(getAddresses.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getAddresses.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.addresses = action.payload?.addresses ?? action.payload ?? [];
      })

      .addCase(getAddresses.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload;
      });

    // =====================
    // CREATE
    // =====================

    builder
      .addCase(createAddress.pending, (state) => {
        state.createLoading = true;

        state.error = null;
      })

      .addCase(createAddress.fulfilled, (state, action) => {
        state.createLoading = false;

        const address = action.payload?.address ?? action.payload;

        if (address) {
          state.addresses.push(address);
        }
      })

      .addCase(createAddress.rejected, (state, action) => {
        state.createLoading = false;

        state.error = action.payload;
      });

    // =====================
    // UPDATE
    // =====================

    builder
      .addCase(updateAddress.pending, (state) => {
        state.updateLoading = true;

        state.error = null;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updated = action.payload?.address ?? action.payload;

        if (!updated) return;

        const index = state.addresses.findIndex(
          (address) => address.id === updated.id,
        );

        if (index !== -1) {
          state.addresses[index] = updated;
        }
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.updateLoading = false;

        state.error = action.payload;
      });

    // =====================
    // DELETE
    // =====================

    builder
      .addCase(deleteAddress.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deletingId = null;

        state.addresses = state.addresses.filter(
          (address) => address.id !== action.payload,
        );
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.deletingId = null;

        state.error = action.payload;
      });

    // =====================
    // DEFAULT
    // =====================

    builder
      .addCase(setDefaultAddress.pending, (state, action) => {
        state.defaultLoadingId = action.meta.arg;
      })

      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.defaultLoadingId = null;

        state.addresses = state.addresses.map((address) => ({
          ...address,

          isDefault: address.id === action.payload,
        }));
      })

      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.defaultLoadingId = null;

        state.error = action.payload;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
