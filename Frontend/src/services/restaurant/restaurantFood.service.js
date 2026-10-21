import apiClient from "../../api/apiClient";

// =============================
// GET MY FOODS
// =============================

export const getMyFoodsService = async () => {
  const response = await apiClient.get("/restaurant/foods");

  return response.data?.data ?? response.data;
};

// =============================
// CREATE FOOD
// =============================

export const createFoodService = async (formData) => {
  const response = await apiClient.post("/restaurant/foods", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data ?? response.data;
};

// =============================
// UPDATE FOOD
// =============================

export const updateFoodService = async ({ foodSlug, formData }) => {
  const response = await apiClient.patch(
    `/restaurant/foods/${foodSlug}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

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
