import {
  Flex,
  Box,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useLocation } from "wouter";
import InputWithLabel from "../components/InputWithLabel";
import PasswordForm from "../components/passwordForm";
import { signInSchema } from "../schemas/signIn.schema";
import { toastConfig } from "../services/toastConfig";
import { useAuth } from "../components/hooks/useAuth";

let errorToastCount = 0;

export default function SignIn() {
  const toast = useToast();
  const { signIn } = useAuth();

  const onSubmit = async (values, actions) => {
    try {
      await signIn(actions, values);
    } catch (e) {
      const { error, message, statusCode } = e.response.data;
      ++errorToastCount;
      const errorId = `SignInError${message}${errorToastCount}`;
      console.log(errorId);
      toast({
        id: errorId,
        duration: 3000,
        status: "error",
        position: "bottom-left",
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, "Sign in failed", message, null),
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
      email: "",
      password: "",
    },
    validationSchema: signInSchema,

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
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool{" "}
              <Link href="#" color="4299e1">
                features
              </Link>{" "}
              ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
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
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link
                    style={{
                      color: "#4299e1",
                    }}
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  disabled={isSubmitting}
                  opacity={isSubmitting ? 0.35 : 1}
                  type="submit"
                  loadingText="Submitting"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
