import apiClient from "../../api/apiClient";

export const getRestaurantDashboardService = async () => {
  const response = await apiClient.get("/restaurant/dashboard");

  return response.data;
};
