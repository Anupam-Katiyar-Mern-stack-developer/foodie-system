import apiClient from "../../api/apiClient";

// GET CURRENT OFFER
export const getDeliveryOfferService = async () => {
  const response = await apiClient.get("/delivery/orders/offers");

  return response.data;
};

// ACCEPT OFFER
export const acceptDeliveryOfferService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/accept`,
  );

  return response.data;
};

// REJECT OFFER
export const rejectDeliveryOfferService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/reject`,
  );

  return response.data;
};
