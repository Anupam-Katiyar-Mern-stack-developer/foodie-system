import apiClient from "../api/apiClient";
const prefix = (kind) =>
  ({
    user: "/user",
    restaurant: "/restaurant",
    delivery: "/delivery",
    admin: "/admin",
  }[kind]);
export const getVerificationStatus = async (kind, signal) =>
  (await apiClient.get(`${prefix(kind)}/email-verification`, { signal })).data
    .data;
export const sendVerificationCode = async (kind) =>
  (
    await apiClient.post(
      `${prefix(kind)}/email-verification/send`,
      {},
      { timeout: 45000 }
    )
  ).data.data;
export const verifyEmailCode = async (kind, code) =>
  (await apiClient.post(`${prefix(kind)}/email-verification/verify`, { code }))
    .data.data;
