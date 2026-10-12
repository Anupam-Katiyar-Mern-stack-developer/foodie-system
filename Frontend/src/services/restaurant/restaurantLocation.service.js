import apiClient from "../../api/apiClient";

export const updateRestaurantLocationService = async ({
  latitude,
  longitude,
}) => {
  const response = await apiClient.patch("/restaurant/location", {
    latitude,
    longitude,
  });

  return response.data;
};