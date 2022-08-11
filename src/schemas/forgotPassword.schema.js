import * as yup from "yup";

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().min(5).email("Please enter a valid email").required(),
});
