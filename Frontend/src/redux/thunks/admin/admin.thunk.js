import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminRequest } from "../../../services/admin/admin.service";
import { STORAGE_KEYS } from "../../../constants/storageKeys";

const message = (error) => error.response?.data?.message || error.message || "Unable to complete request";
const failure = (error, api) => {
  if ([401, 403].includes(error.response?.status)) api.dispatch({ type: "admin/sessionExpired" });
  return api.rejectWithValue(message(error));
};

export const loginAdmin = createAsyncThunk("admin/login", async (values, api) => {
  try {
    const response = await adminRequest("post", "login", values);
    if (!response.data?.token) throw new Error("Login response is missing a token");
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.data.token);
    return response.data;
  } catch (error) { return api.rejectWithValue(message(error)); }
});

export const fetchAdminProfile = createAsyncThunk("admin/profile", async (_, api) => {
  try { return (await adminRequest("get", "profile", undefined, undefined, api.signal)).data; }
  catch (error) { return failure(error, api); }
});

export const fetchAdminResource = createAsyncThunk("admin/resource", async ({ resource, params = {} }, api) => {
  try { return await adminRequest("get", resource, undefined, params, api.signal); }
  catch (error) { return failure(error, api); }
});

export const performAdminAction = createAsyncThunk("admin/action", async ({ method = "patch", path, payload }, api) => {
  try { return await adminRequest(method, path, payload); }
  catch (error) { return failure(error, api); }
});

export const saveAdminProfile = createAsyncThunk("admin/saveProfile", async (values, api) => {
  try { return (await adminRequest("patch", "profile", values)).data; }
  catch (error) { return failure(error, api); }
});
