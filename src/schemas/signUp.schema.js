import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const signUpSchema = yup.object().shape({
  fullName: yup.string().min(5).max(30).required("Please enter first name."),
  email: yup.string().min(5).email("Please enter a valid email").required(),
  password: yup
    .string()
    .min(5)
    .required("Please enter password.")
    .matches(passwordRules, {
      message:
        "Entered Password should include min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit",
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null],"Passwords does not match.")
    .min(5)
    .required("Please enter above password again")
    .matches(passwordRules, {
      message:
        "Entered Password should include min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit",
    }),
});
