import * as yup from "yup";

export const SignUpSchema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is a required field"),
    password: yup.string().required("Password is a required field"),
    first_name: yup.string().required("First Name is a required field"),
    last_name: yup.string().required("Last Name is a required field"),
    // term: yup.string().required("Term is a required field"),
  })
  .required();
