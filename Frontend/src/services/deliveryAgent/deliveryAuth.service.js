import apiClient from "../../api/apiClient";

export const registerDeliveryAgentService = async (payload) => {
  const response = await apiClient.post("/delivery/register", payload);

  return response.data;
};

export const loginDeliveryAgentService = async (payload) => {
  const response = await apiClient.post("/delivery/login", payload);

  return response.data;
};
