import * as yup from "yup";

export const ForgotPassSchema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is a required field"),
  })
  .required();
