import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schema";


const baseURL = import.meta.env.VITE_BASE_URL

const onSubmit = async (values, actions) => {
  const res = await fetch(
    `${baseURL}user/send-reset-password-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  res.status === 201 && actions.resetForm();
};

export default function ForgotPasswordForm() {
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
    },
    validationSchema: forgotPasswordSchema,
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
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Forgot your password?
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            You&apos;ll get an email with a reset link
          </Text>
          <FormControl>
            <Input
              id="email"
              isRequired
              value={values.email}
              onChange={handleChange}
              label="Email"
              type="email"
              onBlur={handleBlur}
              borderColor={
                errors.email && touched.email ? "#fc8181" : "inherit"
              }
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
            />
            {errors.email && touched.email && (
              <Text textAlign={"start"} color={"#fc8181"}>
                {errors.email}
              </Text>
            )}
          </FormControl>
          <Stack spacing={6}>
            <Button
              type="submit"
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.35 : 1}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Request Reset
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
