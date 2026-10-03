export const addressFields = [
{
  name: "label",
  label: "Address Type",
  type: "select",
  placeholder: "Select address type",
  required: true,

  options: [
    {
      label: "Home",
      value: "Home",
    },
    {
      label: "Work",
      value: "Work",
    },
    {
      label: "Other",
      value: "Other",
    },
  ],
},

  {
    name: "addressLine",
    label: "Address",
    type: "textarea",
    placeholder: "House no, street, area",
    required: true,
    fullWidth: true,
  },

  {
    name: "landmark",
    label: "Landmark",
    type: "text",
    placeholder: "Near market, school etc.",
  },

  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Kanpur",
    required: true,
  },

  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "Uttar Pradesh",
    required: true,
  },

  {
    name: "pincode",
    label: "Pincode",
    type: "text",
    placeholder: "208001",
    required: true,

    componentProps: {
      inputMode: "numeric",
      maxLength: 6,
    },
  },
];


export const addressDefaultValues = {
  label: "Home",
  addressLine: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};