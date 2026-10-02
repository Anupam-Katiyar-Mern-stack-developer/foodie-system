export const registerFields = [
  {
    name: "name",

    label: "Full Name",

    type: "text",

    placeholder: "Enter your full name",

    required: true,
  },

  {
    name: "email",

    label: "Email Address",

    type: "email",

    placeholder: "Enter your email",

    required: true,
  },

  {
    name: "phone",

    label: "Phone Number",

    type: "text",

    placeholder: "Enter 10 digit mobile number",

    required: true,

    componentProps: {
      inputMode: "numeric",

      maxLength: 10,
    },
  },

  {
    name: "password",

    label: "Password",

    type: "password",

    placeholder: "Create password",

    required: true,
  },

  {
    name: "confirmPassword",

    label: "Confirm Password",

    type: "password",

    placeholder: "Enter password again",

    required: true,
  },
];

export const registerDefaultValues = {
  name: "",

  email: "",

  phone: "",

  password: "",

  confirmPassword: "",
};
