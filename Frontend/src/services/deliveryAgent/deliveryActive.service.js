import apiClient from "../../api/apiClient";

export const getActiveDeliveryService = async () => {
  const response = await apiClient.get("/delivery/orders/active");
  return response.data;
};

export const pickupDeliveryService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/pickup`,
  );

  return response.data;
};

export const startDeliveryService = async (orderNumber) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/out-for-delivery`,
  );

  return response.data;
};

export const completeDeliveryService = async ({ orderNumber, otp }) => {
  const response = await apiClient.patch(
    `/delivery/orders/${orderNumber}/complete`,
    { otp },
  );

  return response.data;
};