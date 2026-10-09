import * as yup from "yup";

export const deliveryLoginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: yup.string().required("Password is required"),
});
