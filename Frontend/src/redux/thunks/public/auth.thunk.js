import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUserProfileService,
  loginUserService,
  registerUserService,
} from "../../../services/public/auth.service";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

// =============================
// ERROR HELPER
// =============================

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

// =============================
// REGISTER
// =============================

export const registerUser = createAsyncThunk(
  "publicAuth/registerUser",

  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload);
      
      return await registerUserService(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
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
      const data = await loginUserService(payload);

      /*
          ApiResponse shape support:

          data = {
            token,
            user
          }

          OR

          data = {
            accessToken,
            user
          }
        */

      const token = data?.token || data?.accessToken;

      if (!token) {
        return rejectWithValue(
          "Login succeeded but token was not returned by the server.",
        );
      }

      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);

      return {
        token,

        user: data?.user || null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
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
      const data = await getUserProfileService();

      const user = data?.user || data;

      return {
        token,

        user,

        isAuthenticated: true,
      };
    } catch (error) {
      /*
          Stored JWT invalid /
          expired hua to remove.
        */

      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);

      return rejectWithValue(getErrorMessage(error));
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
