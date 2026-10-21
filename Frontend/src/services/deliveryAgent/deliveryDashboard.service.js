import apiClient from "../../api/apiClient";

export const getDeliveryDashboardService = async () => {
  const response = await apiClient.get("/delivery/dashboard");

  return response.data;
};

export const getDeliveryEarningsService = async (params, signal) =>
  (await apiClient.get("/delivery/earnings", { params, signal })).data.data;
