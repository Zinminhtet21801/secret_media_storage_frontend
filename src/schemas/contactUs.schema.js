import * as yup from "yup";

export const contactUsSchema = yup.object().shape({
  email: yup.string().min(5).email("Please enter a valid email").required(),
  fullName: yup.string().required("Please enter a name"),
  message: yup.string().required("Please enter a message"),
});
