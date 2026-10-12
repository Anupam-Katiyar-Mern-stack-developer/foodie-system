import apiClient from "../../api/apiClient";

export const updateDeliveryLocationService = async ({
  latitude,
  longitude,
}) => {
  const response = await apiClient.patch("/delivery/location", {
    latitude,
    longitude,
  });

  return response.data;
};
