import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSiteSettings } from "../../../services/public/setting.service";
export const fetchSiteSettings = createAsyncThunk(
  "siteSettings/fetch",
  async (_, api) => {
    try {
      return await getSiteSettings();
    } catch (error) {
      return api.rejectWithValue(
        error.response?.data?.message || "Unable to load site settings"
      );
    }
  }
);
