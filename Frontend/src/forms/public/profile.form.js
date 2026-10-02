export const profileFields = [
  {
    name: "name",

    label: "Full Name",

    type: "text",

    placeholder: "Enter your full name",

    required: true,
  },

  {
    name: "phone",

    label: "Phone Number",

    type: "text",

    placeholder: "Enter mobile number",

    required: true,

    componentProps: {
      inputMode: "numeric",

      maxLength: 10,
    },
  },
];
