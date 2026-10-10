import { createSlice } from "@reduxjs/toolkit";

import {
  getDeliveryProfile,
  updateDeliveryProfile,
  updateDeliveryOnlineStatus,
} from "../../thunks/deliveryAgent/deliveryProfile.thunk";

const initialState = {
  profile: null,

  fetchLoading: false,
  updateLoading: false,
  statusLoading: false,

  error: null,
  updateError: null,
  statusError: null,
};

// API kabhi:
// { success, message, data }
//
// aur kabhi direct object return kare,
// dono case handle honge.
const getResponseData = (payload) => {
  return payload?.data ?? payload ?? null;
};

const deliveryProfileSlice = createSlice({
  name: "deliveryProfile",

  initialState,

  reducers: {
    clearDeliveryProfileErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.statusError = null;
    },
  },

  extraReducers: (builder) => {
    // =========================================
    // GET PROFILE
    // =========================================

    builder
      .addCase(getDeliveryProfile.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(getDeliveryProfile.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.error = null;

        state.profile = getResponseData(action.payload);
      })

      .addCase(getDeliveryProfile.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Unable to load delivery profile";
      });

    // =========================================
    // UPDATE PROFILE
    // =========================================

    builder
      .addCase(updateDeliveryProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })

      .addCase(updateDeliveryProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;

        const updatedProfile = getResponseData(action.payload);

        if (updatedProfile) {
          state.profile = {
            ...state.profile,
            ...updatedProfile,
          };
        }
      })

      .addCase(updateDeliveryProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Unable to update profile";
      });

    // =========================================
    // ONLINE STATUS
    // =========================================

    builder
      .addCase(updateDeliveryOnlineStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusError = null;
      })

      .addCase(updateDeliveryOnlineStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusError = null;

        const updatedStatus = getResponseData(action.payload);

        if (updatedStatus) {
          state.profile = {
            ...state.profile,
            ...updatedStatus,
          };
        }
      })

      .addCase(updateDeliveryOnlineStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusError = action.payload || "Unable to update online status";
      });
  },
});

export const { clearDeliveryProfileErrors } = deliveryProfileSlice.actions;

export default deliveryProfileSlice.reducer;
