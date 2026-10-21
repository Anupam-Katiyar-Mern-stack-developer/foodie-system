import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  forgotPasswordApi,
  resetPasswordApi,
} from "../../../services/common/passwordReset.service";

export const forgotPassword = createAsyncThunk(
  "passwordReset/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send password reset link",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await resetPasswordApi(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password",
      );
    }
  },
);
