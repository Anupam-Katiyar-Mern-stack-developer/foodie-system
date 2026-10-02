import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    name: "Anupam Katiyar",

    email: "anupam@example.com",

    phone: "9876543210",
  },

  fetchLoading: false,

  updateLoading: false,

  error: null,
};

const profileSlice = createSlice({
  name: "publicProfile",

  initialState,

  reducers: {
    updateProfileLocal: (state, action) => {
      state.profile = {
        ...state.profile,

        ...action.payload,
      };
    },
  },
});

export const { updateProfileLocal } = profileSlice.actions;

export default profileSlice.reducer;
