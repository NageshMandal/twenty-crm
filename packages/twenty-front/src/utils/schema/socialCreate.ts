import * as yup from "yup";

export const SocialCreateSchema = yup
  .object({
    name: yup.string().required("Social name is a required field"),
    url: yup
      .string()
      .required("Sale Navi URL is a required field")
      .matches(/^https:\/\/www\.linkedin\.com\/sales\/lists\//, "Invalid Sales Navigator URL"),
    profileNumber: yup
      .number()
      .min(1, "Number of profiles must be more than 0")
      .max(1000, "Number of profiles must be less than 1000")
      .transform((value) => (isNaN(value) ? undefined : value)),
  })
  .required();
