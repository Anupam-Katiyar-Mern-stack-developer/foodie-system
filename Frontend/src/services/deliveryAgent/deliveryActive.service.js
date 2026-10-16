import apiClient from "../../api/apiClient";

export const getActiveOrderService = async (orderNumber) => {
  const response = await apiClient.get(`/delivery/order/${orderNumber}`);

  return response.data;
};
