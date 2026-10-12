import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUserProfileService,
  loginUserService,
  registerUserService,
} from "../../../services/public/auth.service";

import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

// =============================
// REGISTER
// =============================

export const registerUser = createAsyncThunk(
  "publicAuth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerUserService(payload);

      showSuccessToast(data?.message || "Registration successful");

      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed");

      showErrorToast(message);

      return rejectWithValue(message);
    }
  },
);

// =============================
// LOGIN
// =============================

export const loginUser = createAsyncThunk(
  "publicAuth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUserService(payload);

      // API response direct ho ya data ke andar,
      // dono cases handle karega.
      const data = response?.data || response;

      const token = data?.token || data?.accessToken || data?.userToken;

      if (!token) {
        const message =
          "Login succeeded but token was not returned by the server.";

        showErrorToast(message);

        return rejectWithValue(message);
      }

      // TOKEN SAVE
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);

      showSuccessToast(
        response?.message || data?.message || "Login successful",
      );

      return {
        token,
        user: data?.user || null,
      };
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");

      showErrorToast(message);

      return rejectWithValue(message);
    }
  },
);

// =============================
// RESTORE USER AFTER REFRESH
// =============================

export const bootstrapUserAuth = createAsyncThunk(
  "publicAuth/bootstrapUserAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    if (!token) {
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }

    try {
      const response = await getUserProfileService();

      const data = response?.data || response;

      const user = data?.user || data;

      return {
        token,
        user,
        isAuthenticated: true,
      };
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);

      const message = getErrorMessage(error, "Unable to restore user session");

      return rejectWithValue(message);
    }
  },
);

// =============================
// LOGOUT
// =============================

export const logoutUser = createAsyncThunk(
  "publicAuth/logoutUser",
  async () => {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);

    return true;
  },
);
