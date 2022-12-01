import * as yup from "yup";

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Field is required"),
  newPassword: yup
    .string()
    .required("Field is required")
    .min(8, "Password must contain 8 characters"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
