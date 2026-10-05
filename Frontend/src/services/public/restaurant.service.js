import apiClient from "../../api/apiClient";


// =========================
// RESPONSE DATA
// =========================

const getData = (response) => {
  return (
    response?.data?.data ??
    response?.data
  );
};


// =========================
// GET RESTAURANTS
// HOME + RESTAURANTS PAGE
// =========================

export const getRestaurantsService =
  async ({
    page = 1,
    limit = 20,
  } = {}) => {

    const response =
      await apiClient.get(
        "/restaurants",
        {
          params: {
            page,
            limit,
          },
        }
      );

    return getData(response);
  };


// =========================
// GET RESTAURANT BY SLUG
// RESTAURANT DETAILS
// =========================

export const getRestaurantBySlugService =
  async (slug) => {

    const response =
      await apiClient.get(
        `/restaurants/${slug}`
      );

    return getData(response);
  };