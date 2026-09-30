export const foodFormFields = [
  {
    name: "name",
    type: "text",
    label: "Food Name",
    placeholder: "Enter food name",
    required: true,
  },

  {
    name: "price",
    type: "number",
    label: "Price",
    placeholder: "Enter price",
    required: true,
  },

  {
    name: "discountPrice",
    type: "number",
    label: "Discount Price",
    placeholder: "Enter discount price",
  },

  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter food description",
  },

  {
    name: "categoryId",
    type: "select",
    label: "Category",
    required: true,
  },

  {
    name: "isAvailable",
    type: "switch",
    label: "Available",
  },

  {
    name: "image",
    type: "file",
    label: "Food Image",
  },
];
