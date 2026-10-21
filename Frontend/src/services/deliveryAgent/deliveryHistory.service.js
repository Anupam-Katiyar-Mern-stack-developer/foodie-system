import apiClient from "../../api/apiClient";

export const getDeliveryHistoryService = async (params = {}, signal) => {
  const response = await apiClient.get("/delivery/history", { params, signal });
  return response.data;
};
