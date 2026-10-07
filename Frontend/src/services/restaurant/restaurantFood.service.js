import apiClient from "../../api/apiClient";

// =============================
// GET MY FOODS
// =============================

export const getMyFoodsService = async () => {
  const response = await apiClient.get("/restaurant/foods");

  return response.data?.data ?? response.data;
};

// =============================
// DELETE FOOD
// =============================

export const deleteFoodService = async (foodSlug) => {
  const response = await apiClient.delete(`/restaurant/foods/${foodSlug}`);

  return response.data?.data ?? response.data;
};

// =============================
// TOGGLE AVAILABILITY
// =============================

export const toggleFoodAvailabilityService = async ({
  foodSlug,
  isAvailable,
}) => {
  const response = await apiClient.patch(
    `/restaurant/foods/${foodSlug}/availability`,
    {
      isAvailable,
    },
  );

  return response.data?.data ?? response.data;
};
