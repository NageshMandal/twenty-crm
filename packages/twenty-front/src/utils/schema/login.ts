import * as yup from "yup";

export const LoginSchema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is a required field"),
    password: yup.string().required("Password is a required field"),
  })
  .required();
