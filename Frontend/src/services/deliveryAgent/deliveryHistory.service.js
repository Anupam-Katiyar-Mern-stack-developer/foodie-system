import apiClient from "../../api/apiClient";

export const getDeliveryHistoryService = async (params = {}) => {
  const response = await apiClient.get("/delivery/history", { params });
  return response.data;
};
