export const deliveryRegisterFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter 10 digit phone number",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    name: "vehicleType",
    label: "Vehicle Type",
    type: "select",
    placeholder: "Select vehicle type",
    options: [
      { label: "Bike", value: "BIKE" },
      { label: "Scooter", value: "SCOOTER" },
      { label: "Bicycle", value: "BICYCLE" },
    ],
  },
  {
    name: "vehicleNumber",
    label: "Vehicle Number",
    type: "text",
    placeholder: "Example: UP78 AB 1234",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
  },
];

export const deliveryRegisterDefaultValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  vehicleType: "BIKE",
  vehicleNumber: "",
  password: "",
  confirmPassword: "",
};
