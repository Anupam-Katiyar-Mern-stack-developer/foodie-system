import crypto from "crypto";

const randomCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

export const generateCheckoutNumber = () => {
  return `CHK-${Date.now()}-${randomCode()}`;
};

export const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${randomCode()}`;
};
