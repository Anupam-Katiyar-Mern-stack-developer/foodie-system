import { createSlice } from "@reduxjs/toolkit";

import { getCategories } from "../../thunks/public/category.thunk";

const initialState = {
  categories: [],

  fetchLoading: false,

  error: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

const categorySlice = createSlice({
  name: "publicCategory",

  initialState,

  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET CATEGORIES
      // =========================

      .addCase(getCategories.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.error = null;

        state.categories = action.payload?.categories ?? action.payload ?? [];

        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload || "Unable to load categories";
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer;
