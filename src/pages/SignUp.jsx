import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import InputWithLabel from "../components/InputWithLabel";
import { useFormik } from "formik";
import PasswordForm from "../components/passwordForm";
import { signUpSchema } from "../schemas/signUp.schema";
import { Link, useLocation } from "wouter";
import { toastConfig } from "../services/toastConfig";
import { useAuth } from "../components/hooks/useAuth";

let errorToastCount = 0;

export default function SignUp() {
  const toast = useToast();
  const { signUp } = useAuth();

  const onSubmit = async (values, actions) => {
    try {
      await signUp(actions, values);
    } catch (e) {
      const { error, message, statusCode } = e.response.data;
      ++errorToastCount;
      const errorId = `SignUpError${message}${errorToastCount}`;
      console.log(errorId);
      toast({
        id: errorId,
        duration: 3000,
        status: "error",
        position: "bottom-left",
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, "Sign Up failed", message, null),
      });
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              {/* <HStack> */}
              <InputWithLabel
                id="fullName"
                isRequired
                value={values.fullName}
                onChange={handleChange}
                label="Name"
                type="text"
                onBlur={handleBlur}
                error={errors.fullName && touched.fullName ? true : false}
                errorMessage={
                  errors.fullName && touched.fullName ? errors.fullName : false
                }
              />
              {/* <InputWithLabel
                id="lastName"
                isRequired={false}
                value={values.lastName}
                onChange={handleChange}
                label="Last Name"
                type="text"
              /> */}
              {/* </HStack> */}
              <InputWithLabel
                id="email"
                isRequired
                value={values.email}
                onChange={handleChange}
                label="Email address"
                type="email"
                onBlur={handleBlur}
                error={errors.email && touched.email ? true : false}
                errorMessage={
                  errors.email && touched.email ? errors.email : false
                }
              />

              <PasswordForm
                value={values.password}
                onChange={handleChange}
                id={"password"}
                label={"Password"}
                onBlur={handleBlur}
                error={errors.password && touched.password ? true : false}
                errorMessage={
                  errors.password && touched.password ? errors.password : false
                }
              />
              <PasswordForm
                value={values.confirmPassword}
                onChange={handleChange}
                id={"confirmPassword"}
                label={"Confirm Password"}
                onBlur={handleBlur}
                error={
                  errors.confirmPassword && touched.confirmPassword
                    ? true
                    : false
                }
                errorMessage={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : false
                }
              />
              <Stack spacing={10} pt={2}>
                <Button
                  disabled={isSubmitting}
                  opacity={isSubmitting ? 0.35 : 1}
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    style={{
                      color: "#4299e1",
                    }}
                    href="signin"
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
