import * as yup from "yup";

export const registerSchema = yup.object({
  firstName: yup.string().required("Field is required"),
  lastName: yup.string().required("Field is required"),
  email: yup
    .string()
    .required("Field is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Password must contain 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Field is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Password must contain 8 characters"),
});
