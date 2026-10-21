export const adminLoginFields = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "admin@foodie.com",
    required: true,
    componentProps: { autoComplete: "username" },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    componentProps: { autoComplete: "current-password" },
  },
];

export const adminCategoryFields = (category) => [
  {
    name: "name",
    label: "Category name",
    placeholder: "e.g. North Indian",
    required: true,
  },
  {
    name: "displayOrder",
    label: "Display order",
    type: "number",
    componentProps: { min: 0, step: 1 },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    fullWidth: true,
    placeholder: "Help customers discover this category",
  },
  {
    name: "image",
    label: "Category image",
    type: "file",
    fullWidth: true,
    required: !category,
    existingPreview: category?.image || "",
    helperText: "JPG, PNG or WebP. Use a clear food photograph.",
  },
];

export const adminProfileFields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  {
    name: "currentPassword",
    label: "Current password",
    type: "password",
    required: true,
    helperText: "Required to confirm account changes.",
    componentProps: { autoComplete: "current-password" },
  },
  {
    name: "newPassword",
    label: "New password (optional)",
    type: "password",
    helperText: "Leave empty to keep your current password.",
    componentProps: { autoComplete: "new-password" },
  },
];
