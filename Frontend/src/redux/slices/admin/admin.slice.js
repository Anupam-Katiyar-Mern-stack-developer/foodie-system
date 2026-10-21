import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import {
  loginAdmin,
  fetchAdminProfile,
  fetchAdminResource,
  performAdminAction,
  saveAdminProfile,
} from "../../thunks/admin/admin.thunk";

const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
const resourceState = () => ({
  data: null,
  pagination: null,
  loading: false,
  error: null,
  requestId: null,
});
const initialState = {
  token,
  profile: null,
  sessionStatus: token ? "idle" : "signedOut",
  sessionError: null,
  loginLoading: false,
  loginError: null,
  actionLoading: false,
  resources: Object.fromEntries(
    [
      "dashboard",
      "restaurants",
      "delivery-agents",
      "categories",
      "foods",
      "orders",
      "users",
    ].map((key) => [key, resourceState()])
  ),
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      state.token = null;
      state.profile = null;
      state.sessionStatus = "signedOut";
      state.resources = Object.fromEntries(
        Object.keys(state.resources).map((key) => [key, resourceState()])
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginAdmin.fulfilled, (state, { payload }) => {
        state.loginLoading = false;
        state.token = payload.token;
        state.profile = payload.admin;
        state.sessionStatus = "ready";
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      })
      .addCase(fetchAdminProfile.pending, (state) => {
        state.sessionStatus = "loading";
        state.sessionError = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        if (!state.token) return;
        state.profile = action.payload;
        state.sessionStatus = "ready";
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        if (!state.token) return;
        state.sessionStatus = "error";
        state.sessionError = action.payload;
      })
      .addCase(fetchAdminResource.pending, (state, action) => {
        const item = state.resources[action.meta.arg.resource];
        if (item) {
          item.loading = true;
          item.error = null;
          item.requestId = action.meta.requestId;
        }
      })
      .addCase(fetchAdminResource.fulfilled, (state, action) => {
        const item = state.resources[action.meta.arg.resource];
        if (!state.token || !item || item.requestId !== action.meta.requestId)
          return;
        item.data = action.payload.data;
        item.pagination = action.payload.pagination || null;
        item.loading = false;
      })
      .addCase(fetchAdminResource.rejected, (state, action) => {
        const item = state.resources[action.meta.arg.resource];
        if (!item || item.requestId !== action.meta.requestId) return;
        item.loading = false;
        if (!action.meta.aborted)
          item.error = action.payload || "Request failed";
      })
      .addCase(performAdminAction.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(performAdminAction.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(performAdminAction.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(saveAdminProfile.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(saveAdminProfile.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;
      })
      .addCase(saveAdminProfile.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { sessionExpired } = adminSlice.actions;
export default adminSlice.reducer;
