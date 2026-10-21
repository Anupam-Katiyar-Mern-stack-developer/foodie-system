import apiClient from "../../api/apiClient";

// =============================
// GET PROFILE
// =============================

export const getRestaurantProfileService = async () => {
  const response = await apiClient.get("/restaurant/profile");

  return response.data;
};

// =============================
// UPDATE PROFILE
// =============================

export const updateRestaurantProfileService = async (payload) => {
  const response = await apiClient.patch("/restaurant/profile", payload);

  return response.data;
};


// =============================
// UPDATE OPEN / CLOSE STATUS
// =============================
export const updateRestaurantStatusService = async (isOpen) => {
  const response = await apiClient.patch("/restaurant/status", {
    isOpen,
  });

  return response.data?.data ?? response.data;
};
