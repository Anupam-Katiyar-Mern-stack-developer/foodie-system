import apiClient from "../../api/apiClient";

const getData = (response) => {
  return response?.data?.data ?? response?.data;
};

// =========================
// GET ALL
// =========================

export const getAddressesService = async () => {
  const response = await apiClient.get("/user/addresses");

  return getData(response);
};

// =========================
// CREATE
// =========================

export const createAddressService = async (payload) => {
  const response = await apiClient.post("/user/addresses", payload);

  return getData(response);
};

// =========================
// UPDATE
// =========================

export const updateAddressService = async (addressId, payload) => {
  const response = await apiClient.put(`/user/addresses/${addressId}`, payload);

  return getData(response);
};

// =========================
// DELETE
// =========================

export const deleteAddressService = async (addressId) => {
  const response = await apiClient.delete(`/user/addresses/${addressId}`);

  return getData(response);
};

// =========================
// SET DEFAULT
// =========================

export const setDefaultAddressService = async (addressId) => {
  const response = await apiClient.patch(
    `/user/addresses/${addressId}/default`,
  );

  return getData(response);
};
