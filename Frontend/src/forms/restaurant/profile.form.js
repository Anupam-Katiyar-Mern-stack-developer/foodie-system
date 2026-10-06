export const restaurantProfileDefaultValues = {
  ownerName: "",
  restaurantName: "",
  phone: "",
  description: "",

  addressLine: "",
  city: "",
  state: "",
  pincode: "",

  latitude: "",
  longitude: "",

  logo: null,
};


export const restaurantProfileFields = [
  {
    name: "ownerName",
    label: "Owner Name",
    type: "text",
    placeholder: "Enter owner name",
    required: true,
  },

  {
    name: "restaurantName",
    label: "Restaurant Name",
    type: "text",
    placeholder: "Enter restaurant name",
    required: true,
  },

  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
    required: true,
  },

  {
    name: "description",
    label: "Restaurant Description",
    type: "textarea",
    placeholder:
      "Tell customers about your restaurant...",
    fullWidth: true,
    rows: 4,
  },

  {
    name: "addressLine",
    label: "Address",
    type: "text",
    placeholder:
      "Enter complete restaurant address",
    required: true,
    fullWidth: true,
  },

  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Enter city",
    required: true,
  },

  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "Enter state",
    required: true,
  },

  {
    name: "pincode",
    label: "Pincode",
    type: "text",
    placeholder: "Enter pincode",
    required: true,
  },

  {
    name: "latitude",
    label: "Latitude",
    type: "number",
    placeholder: "Example: 26.4499",
  },

  {
    name: "longitude",
    label: "Longitude",
    type: "number",
    placeholder: "Example: 80.3319",
  },

  {
    name: "logo",
    label: "Restaurant Logo",
    type: "file",
    fullWidth: true,

    componentProps: {
      accept:
        "image/png,image/jpeg,image/jpg,image/webp",
    },
  },
];