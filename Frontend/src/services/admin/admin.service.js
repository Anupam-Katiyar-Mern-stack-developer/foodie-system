import apiClient from "../../api/apiClient";

export const adminRequest = async (method, path, payload, params, signal) => {
  const response = await apiClient.request({
    method,
    url: `/admin/${path}`,
    data: payload,
    params,
    signal,
    ...(payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {}),
  });
  return response.data;
};
