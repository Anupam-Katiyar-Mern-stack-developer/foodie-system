import apiClient from "../../api/apiClient";

const getData = (response) => {
  return response?.data?.data ?? response?.data;
};

export const getCategoriesService = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get("/categories", {
    params: {
      page,
      limit,
    },
  });

  return getData(response);
};
