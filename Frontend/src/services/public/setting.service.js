import apiClient from "../../api/apiClient";
export const getSiteSettings = async () =>
  (await apiClient.get("/settings")).data.data;

export const getSiteOffers = async () =>
  (await apiClient.get("/settings/offers")).data.data;
