import apiClient from "../../api/apiClient";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data;
};

// =============================
// REGISTER
// =============================

export const registerUserService = async (payload) => {
  const response = await apiClient.post("/user/register", payload);

  return getResponseData(response);
};

// =============================
// LOGIN
// =============================

export const loginUserService = async (payload) => {
  const response = await apiClient.post("/user/login", payload);

  return getResponseData(response);
};

// =============================
// PROFILE
// =============================

export const getUserProfileService = async () => {
  const response = await apiClient.get("/user/profile");

  return getResponseData(response);
};
