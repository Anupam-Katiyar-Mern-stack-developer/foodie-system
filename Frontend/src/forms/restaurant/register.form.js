export const restaurantRegisterDefaultValues = {
  ownerName: "",
  restaurantName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  description: "",

  addressLine: "",
  city: "",
  state: "",
  pincode: "",

};

export const restaurantRegisterFields = [
  {
    name: "ownerName",
    label: "Owner Name",
    type: "text",
    placeholder: "Enter owner's full name",
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
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "restaurant@example.com",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter mobile number",
    required: true,
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
    placeholder: "Confirm your password",
    required: true,
  },
  {
    name: "description",
    label: "Restaurant Description",
    type: "textarea",
    placeholder: "Tell us about your restaurant...",
    fullWidth: true,
    rows: 4,
  },
  {
    name: "addressLine",
    label: "Complete Address",
    type: "text",
    placeholder: "Street, building, area, landmark",
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
    placeholder: "6 digit pincode",
    required: true,
  },

];
