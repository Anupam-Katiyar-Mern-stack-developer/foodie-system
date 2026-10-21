import { createSlice } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

import {
  loginDeliveryAgent,
  registerDeliveryAgent,
} from "../../thunks/deliveryAgent/deliveryAuth.thunk";

const storedToken = localStorage.getItem(STORAGE_KEYS.DELIVERY_TOKEN);

const initialState = {
  deliveryToken: storedToken,

  deliveryAgent: null,

  isAuthenticated: Boolean(storedToken),

  loginLoading: false,

  registerLoading: false,

  error: null,
};

const deliveryAuthSlice = createSlice({
  name: "deliveryAuth",

  initialState,

  reducers: {
    // =====================
    // CLEAR ERROR
    // =====================

    clearDeliveryAuthError: (state) => {
      state.error = null;
    },

    // =====================
    // LOGOUT
    // =====================

    logoutDeliveryAgent: (state) => {
      localStorage.removeItem(STORAGE_KEYS.DELIVERY_TOKEN);

      state.deliveryToken = null;

      state.deliveryAgent = null;

      state.isAuthenticated = false;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================
      // REGISTER
      // =================================

      .addCase(
        registerDeliveryAgent.pending,

        (state) => {
          state.registerLoading = true;

          state.error = null;
        },
      )

      .addCase(
        registerDeliveryAgent.fulfilled,

        (state) => {
          state.registerLoading = false;

          state.error = null;
        },
      )

      .addCase(
        registerDeliveryAgent.rejected,

        (state, action) => {
          state.registerLoading = false;

          state.error = action.payload || "Unable to register";
        },
      )

      // =================================
      // LOGIN
      // =================================

      .addCase(
        loginDeliveryAgent.pending,

        (state) => {
          state.loginLoading = true;

          state.error = null;
        },
      )

      .addCase(
        loginDeliveryAgent.fulfilled,

        (state, action) => {
          state.loginLoading = false;

          state.deliveryToken = action.payload.token;

          state.deliveryAgent = action.payload.deliveryAgent;

          state.isAuthenticated = true;

          state.error = null;
        },
      )

      .addCase(
        loginDeliveryAgent.rejected,

        (state, action) => {
          state.loginLoading = false;

          state.isAuthenticated = false;

          state.error = action.payload || "Unable to login";
        },
      );
  },
});

export const { clearDeliveryAuthError, logoutDeliveryAgent } =
  deliveryAuthSlice.actions;

export default deliveryAuthSlice.reducer;
