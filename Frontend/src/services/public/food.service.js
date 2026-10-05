import apiClient from "../../api/apiClient";


const getData = (response) => {
  return (
    response?.data?.data ??
    response?.data
  );
};


// =========================
// GET ALL FOODS
// HOME PAGE
// =========================

export const getFoodsService =
  async ({
    page = 1,
    limit = 20,
  } = {}) => {

    const response =
      await apiClient.get(
        "/foods",
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
// GET RESTAURANT FOODS
// RESTAURANT DETAILS
// =========================

export const getRestaurantFoodsService =
  async ({
    restaurantSlug,
    page = 1,
    limit = 20,
  }) => {

    const response =
      await apiClient.get(
        `/restaurants/${restaurantSlug}/foods`,
        {
          params: {
            page,
            limit,
          },
        }
      );

    return getData(response);
  };