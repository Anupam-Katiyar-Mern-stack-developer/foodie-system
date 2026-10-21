import apiClient from "../../api/apiClient";

// =========================================
// GET DELIVERY PROFILE
// =========================================

export const getDeliveryProfileService = async () => {
  const response = await apiClient.get("/delivery/profile");

  return response.data;
};

// =========================================
// UPDATE DELIVERY PROFILE
// =========================================

export const updateDeliveryProfileService = async (payload) => {
  const response = await apiClient.put("/delivery/profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================================
// UPDATE ONLINE STATUS
// =========================================

export const updateDeliveryOnlineStatusService = async (isOnline) => {
  const response = await apiClient.patch("/delivery/online-status", {
    isOnline,
  });

  return response.data;
};
