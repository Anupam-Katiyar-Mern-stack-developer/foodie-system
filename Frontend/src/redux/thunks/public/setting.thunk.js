import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSiteSettings,
  getSiteOffers,
} from "../../../services/public/setting.service";
export const fetchSiteSettings = createAsyncThunk(
  "siteSettings/fetch",
  async (_, api) => {
    try {
      const [settings, offers] = await Promise.all([
        getSiteSettings(),
        getSiteOffers().catch(() => []),
      ]);
      return { settings, offers };
    } catch (error) {
      return api.rejectWithValue(
        error.response?.data?.message || "Unable to load site settings"
      );
    }
  }
);
