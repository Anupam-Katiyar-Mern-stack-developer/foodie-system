import { createAsyncThunk } from "@reduxjs/toolkit";

import { getCategoriesService } from "../../../services/public/category.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";

export const getCategories = createAsyncThunk(
  "publicCategory/getCategories",

  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await getCategoriesService(params);

      return result;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load categories"),
      );
    }
  },
);
