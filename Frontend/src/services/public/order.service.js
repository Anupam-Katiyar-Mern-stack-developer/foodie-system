import apiClient from "../../api/apiClient";

const getData = (response) => {
  return response?.data?.data ?? response?.data;
};

// =========================
// GET MY ORDERS
// =========================

export const getMyOrdersService = async () => {
  const response = await apiClient.get("/user/orders");

  return getData(response);
};

// =========================
// PLACE ORDER
// =========================

export const placeOrderService = async ({
  addressId,
  paymentMethod,
  latitude,
  longitude,
  couponCode,
  requestKey,
  expectedTotal,
}) => {
  const response = await apiClient.post("/user/orders", {
    addressId,
    paymentMethod,
    latitude,
    longitude,
    couponCode,
    requestKey,
    expectedTotal,
  });

  return getData(response);
};
