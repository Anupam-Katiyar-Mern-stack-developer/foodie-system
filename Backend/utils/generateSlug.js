import crypto from "crypto";

export const generateSlug = (restaurantName, city) => {
  const baseSlug = `${restaurantName}-${city}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueCode = crypto.randomBytes(4).toString("hex");

  return `${baseSlug}-${uniqueCode}`;
};
