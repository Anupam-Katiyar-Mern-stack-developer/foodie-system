import apiClient from "../../api/apiClient";

export const getDeliveryDashboardService = async () => {
  const response = await apiClient.get("/delivery/dashboard");

  return response.data;
};
