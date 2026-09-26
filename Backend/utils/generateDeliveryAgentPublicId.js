import crypto from "crypto";

export const generateDeliveryAgentPublicId = () => {
  const code = crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();

  return `DA-${code}`;
};