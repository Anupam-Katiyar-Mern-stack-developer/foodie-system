import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,

  token: null,

  isAuthenticated: false,

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
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
