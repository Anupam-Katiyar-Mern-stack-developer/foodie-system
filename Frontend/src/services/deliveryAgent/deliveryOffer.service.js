import apiClient from "../../api/apiClient";

// =========================================
// GET DELIVERY OFFER
// =========================================

export const getDeliveryOfferService = async () => {
  const response = await apiClient.get("/delivery/orders/offers");

  return response.data;
};

// =========================================
// ACCEPT DELIVERY OFFER
// =========================================

export const acceptDeliveryOfferService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/accept`,
  );

  return response.data;
};

// =========================================
// REJECT DELIVERY OFFER
// =========================================

export const rejectDeliveryOfferService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/reject`,
  );

  return response.data;
};
