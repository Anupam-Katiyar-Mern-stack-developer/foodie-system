import crypto from "crypto";

export const generateFoodSlug = (name) => {
  const baseSlug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueCode = crypto
    .randomBytes(4)
    .toString("hex");

  return `${baseSlug}-${uniqueCode}`;
};