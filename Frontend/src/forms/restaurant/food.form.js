export const foodDefaultValues = {
  name: "",
  description: "",
  categorySlug: "",
  price: "",
  discountPrice: "",
  preparationTime: "",
  isVeg: true,
  isAvailable: true,
  image: null,
};


export const getFoodFields = (
  categories = []
) => {
  return [
    {
      name: "name",
      label: "Food Name",
      type: "text",
      placeholder:
        "Enter food name",
      required: true,
    },

    {
      name: "categorySlug",
      label: "Category",
      type: "select",
      placeholder:
        "Select category",
      required: true,

      options:
        categories
          .filter(
            (category) =>
              category.isActive !==
              false
          )
          .map(
            (category) => ({
              label:
                category.name,

              value:
                category.slug,
            })
          ),
    },

    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder:
        "Enter price",
      required: true,

      componentProps: {
        min: 1,
        step: "0.01",
      },
    },

    {
      name: "discountPrice",
      label: "Discount Price",
      type: "number",
      placeholder:
        "Optional discount price",

      componentProps: {
        min: 0,
        step: "0.01",
      },
    },

    {
      name: "preparationTime",
      label: "Preparation Time",
      type: "number",
      placeholder:
        "Example: 20",
      required: true,

      componentProps: {
        min: 1,
      },
    },

    {
      name: "isVeg",
      label: "Vegetarian Food",
      type: "switch",
    },

    {
      name: "isAvailable",
      label: "Available For Order",
      type: "switch",
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder:
        "Write food description...",

      rows: 4,
      fullWidth: true,
    },

    {
      name: "image",
      label: "Food Image",
      type: "file",
      fullWidth: true,

      componentProps: {
        accept:
          "image/png,image/jpeg,image/jpg,image/webp",
      },
    },
  ];
};