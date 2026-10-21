import apiClient from "../../api/apiClient";

// =========================================
// GET ORDERS
// =========================================

export const getRestaurantOrdersService = async ({
  page = 1,
  limit = 10,
  status,
  search = "",
  paymentMethod = "ALL",
  paymentStatus = "ALL",
  signal,
}) => {
  const params = {
    page,
    limit,
  };

  if (status) {
    params.status = status;
  }

  const response = await apiClient.get("/restaurant/orders", {
    params: { ...params, search, paymentMethod, paymentStatus },
    signal,
  });
  console.log(response);

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
    `/restaurant/orders/${orderNumber}/accept`
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
    }
  );

  return response.data;
};

// =========================================
// PREPARING
// =========================================

export const markOrderPreparingService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/preparing`
  );

  return response.data;
};

// =========================================
// READY
// =========================================

export const markOrderReadyService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/restaurant/orders/${orderNumber}/ready`
  );

  return response.data;
};

// =========================================
// GET AVAILABLE DELIVERY AGENTS
// =========================================

export const getAvailableDeliveryAgentsService = async (orderNumber) => {
  const response = await apiClient.get(
    `/restaurant/orders/${orderNumber}/delivery-agents`
  );

  return response.data;
};

// =========================================
// SEND DELIVERY OFFER
// =========================================

export const sendRestaurantDeliveryOfferService = async ({
  orderNumber,
  deliveryAgentPublicId,
}) => {
  const response = await apiClient.post(
    `/restaurant/orders/${orderNumber}/delivery-offer`,
    {
      deliveryAgentPublicId,
    }
  );

  return response.data;
};
