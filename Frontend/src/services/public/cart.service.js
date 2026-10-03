import apiClient from "../../api/apiClient";

const getData = (response) => {
  return response?.data?.data ?? response?.data;
};

// =========================
// GET CART
// =========================

export const getCartService = async () => {
  const response = await apiClient.get("/user/cart");

  return getData(response);
};

// =========================
// ADD ITEM
// =========================

export const addCartItemService = async ({ foodSlug, quantity = 1 }) => {
  const response = await apiClient.post("/user/cart/items", {
    foodSlug,
    quantity,
  });

  return getData(response);
};

// =========================
// UPDATE QUANTITY
// =========================

export const updateCartItemService = async ({ foodSlug, quantity }) => {
  const response = await apiClient.patch(`/user/cart/items/${foodSlug}`, {
    quantity,
  });

  return getData(response);
};

// =========================
// REMOVE ITEM
// =========================

export const removeCartItemService = async (foodSlug) => {
  const response = await apiClient.delete(`/user/cart/items/${foodSlug}`);

  return getData(response);
};

// =========================
// CLEAR CART
// =========================

export const clearCartService = async () => {
  const response = await apiClient.delete("/user/cart");

  return getData(response);
};
