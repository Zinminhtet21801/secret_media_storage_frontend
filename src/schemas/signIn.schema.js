import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const signInSchema = yup.object().shape({
  email: yup.string().min(5).email("Please enter a valid email").required(),
  password: yup
    .string()
    .min(5)
    .required("Please enter password.")
    .matches(passwordRules, {
      message:
        "Entered Password should include min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit",
    })
});
