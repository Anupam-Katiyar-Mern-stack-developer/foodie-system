import apiClient from "../../api/apiClient";

// =========================================
// REGISTER RESTAURANT
// =========================================

export const registerRestaurantService = async (payload) => {
  const response = await apiClient.post("/restaurant/register", payload);

  return response.data;
};

// =========================================
// LOGIN RESTAURANT
// =========================================

export const loginRestaurantService = async (payload) => {
  const response = await apiClient.post("/restaurant/login", payload);

  return response.data;
};
