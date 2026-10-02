import { createSlice } from "@reduxjs/toolkit";

import {
  bootstrapUserAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../../thunks/public/auth.thunk";

const initialState = {
  user: null,

  token: null,

  isAuthenticated: false,

  /*
    App start par auth check
    complete hua ya nahi.
  */
  authReady: false,

  bootstrapLoading: true,

  loginLoading: false,

  registerLoading: false,

  logoutLoading: false,

  error: null,
};

const authSlice = createSlice({
  name: "publicAuth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // BOOTSTRAP
    // =========================

    builder
      .addCase(bootstrapUserAuth.pending, (state) => {
        state.bootstrapLoading = true;

        state.authReady = false;
      })

      .addCase(bootstrapUserAuth.fulfilled, (state, action) => {
        state.bootstrapLoading = false;

        state.authReady = true;

        state.token = action.payload.token;

        state.user = action.payload.user;

        state.isAuthenticated = action.payload.isAuthenticated;
      })

      .addCase(bootstrapUserAuth.rejected, (state) => {
        state.bootstrapLoading = false;

        state.authReady = true;

        state.token = null;

        state.user = null;

        state.isAuthenticated = false;
      });

    // =========================
    // REGISTER
    // =========================

    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;

        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;

        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;

        state.error = action.payload;
      });

    // =========================
    // LOGIN
    // =========================

    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;

        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;

        state.token = action.payload.token;

        state.user = action.payload.user;

        state.isAuthenticated = true;

        state.authReady = true;

        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;

        state.error = action.payload;

        state.isAuthenticated = false;
      });

    // =========================
    // LOGOUT
    // =========================

    builder
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;

        state.user = null;

        state.token = null;

        state.isAuthenticated = false;

        state.authReady = true;

        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
