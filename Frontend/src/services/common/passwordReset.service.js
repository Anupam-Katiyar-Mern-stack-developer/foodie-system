import apiClient from "../../api/apiClient";

export const forgotPasswordApi = async ({ email, accountType }) => {
  const response = await apiClient.post("/auth/forgot-password", {
    email,
    accountType,
  });

  return response.data;
};

export const resetPasswordApi = async ({
  token,
  password,
  confirmPassword,
}) => {
  const response = await apiClient.post(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });

  return response.data;
};
