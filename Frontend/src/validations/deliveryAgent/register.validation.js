import * as yup from "yup";

export const deliveryRegisterSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit phone number")
    .required("Phone number is required"),

  address: yup
    .string()
    .trim()
    .min(5, "Enter a valid address")
    .required("Address is required"),

  vehicleType: yup
    .string()
    .oneOf(["BIKE", "SCOOTER", "BICYCLE"], "Select a valid vehicle type")
    .required("Vehicle type is required"),

  vehicleNumber: yup
    .string()
    .trim()
    .when("vehicleType", {
      is: (value) => value !== "BICYCLE",
      then: (schema) => schema.required("Vehicle number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});
