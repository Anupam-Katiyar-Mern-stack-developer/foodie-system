export const addressFields = [
  {
    name: "addressLine",
    label: "Full Address",
    type: "textarea",
    placeholder: "House number, street, landmark...",
    required: true,
    componentProps: {
      rows: 3,
    },
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
    placeholder: "Enter 6 digit pincode",
    required: true,
    componentProps: {
      inputMode: "numeric",
      maxLength: 6,
    },
  },
];

export const addressDefaultValues = {
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};
