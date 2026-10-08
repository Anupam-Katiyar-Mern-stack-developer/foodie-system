import apiClient from "../../api/apiClient";

// =========================================
// GET ORDERS
// =========================================

export const getRestaurantOrdersService = async ({
  page = 1,
  limit = 10,
  status,
}) => {
  const params = {
    page,
    limit,
  };

  if (status) {
    params.status = status;
  }

  const response = await apiClient.get("/restaurant/orders", {
    params,
  });

  return response.data;
};

// =========================================
// GET SINGLE ORDER
// =========================================

export const getRestaurantOrderService = async (orderNumber) => {
  const response = await apiClient.get(`/restaurant/orders/${orderNumber}`);

  return response.data;
};

// =========================================
// ACCEPT
// =========================================

export const acceptRestaurantOrderService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/accept`,
  );

  return response.data;
};

// =========================================
// REJECT
// =========================================

export const rejectRestaurantOrderService = async ({ orderNumber, reason }) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/reject`,
    {
      reason,
    },
  );

  return response.data;
};

// =========================================
// PREPARING
// =========================================

export const markOrderPreparingService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/preparing`,
  );

  return response.data;
};

// =========================================
// READY
// =========================================

export const markOrderReadyService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/ready`,
  );

  return response.data;
};
