import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineEmail } from "react-icons/md";
import { BsGithub, BsDiscord, BsPerson } from "react-icons/bs";
import { companyDetail } from "../assets/Me";
import { useFormik } from "formik";
import { contactUsSchema } from "../schemas/contactUs.schema";
import axios from "axios";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useUser } from "../components/hooks/useUser";

const baseURL = import.meta.env.VITE_BASE_URL;

const LeftContact = () => {
  const component = companyDetail.map((item, index) => (
    <Button
      key={index}
      size="md"
      height="48px"
      width="200px"
      variant="ghost"
      color="#DCE2FF"
      _hover={{ border: "2px solid #1C6FEB" }}
      leftIcon={item.icon}
    >
      {item.contact}
    </Button>
  ));
  return component;
};

export default function ContactUs() {
  const toast = useToast();
  const { user } = useUser();
  const [location, setLocation] = useLocation();

  const onSubmit = async (values, actions) => {
    try {
      const res = await axios.post(
        `${baseURL}/user/contact`,
        JSON.stringify(values),
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${document.cookie.split("=")[1]}`,
          },
          withCredentials: true,
        }
      );
      
      if (res.status === 201 || res.status === 200) {
        toast({
          title: "Message Sent Successfully!!!",
          description: "We've received your message.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
        setLocation("/home");
      }

    } catch (err) {
      toast({
        title: "Message Failed!!!",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
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
      fullName: "",
      message: "",
    },
    validationSchema: contactUsSchema,
    onSubmit,
  });
  return (
    <Container h={"100%"} maxW="full" mt={0} centerContent overflow="hidden">
      <Flex>
        <Box
          bg="#02054B"
          color="white"
          borderRadius="lg"
          m={{ sm: 4, md: 16, lg: 10 }}
          p={{ sm: 5, md: 5, lg: 16 }}
        >
          <Box p={4}>
            <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
              <WrapItem>
                <Box>
                  <Heading>Contact</Heading>
                  <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                    Fill up the form below to contact
                  </Text>
                  <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                    <VStack pl={0} spacing={3} alignItems="flex-start">
                      <LeftContact />
                    </VStack>
                  </Box>
                </Box>
              </WrapItem>
              <WrapItem>
                <Box bg="white" borderRadius="lg">
                  <Box m={8} color="#0B0E3F">
                    <form onSubmit={handleSubmit} autoComplete="off">
                      <VStack spacing={5}>
                        <FormControl onSubmit={onSubmit}>
                          <FormLabel>Your Name</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement
                              pointerEvents="none"
                              children={<BsPerson color="gray.800" />}
                            />
                            <Input
                              type="text"
                              id="fullName"
                              size="md"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.fullName}
                            />
                          </InputGroup>

                          {errors.fullName && touched.fullName && (
                            <Text textAlign={"start"} color={"#fc8181"}>
                              {errors.fullName}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Mail</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement
                              pointerEvents="none"
                              children={<MdOutlineEmail color="gray.800" />}
                            />
                            <Input
                              type="text"
                              size="md"
                              id="email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                            />
                          </InputGroup>
                          {errors.email && touched.email && (
                            <Text textAlign={"start"} color={"#fc8181"}>
                              {errors.email}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Message</FormLabel>
                          <Textarea
                            id="message"
                            borderColor="gray.300"
                            _hover={{
                              borderRadius: "gray.300",
                            }}
                            placeholder="message"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                          />
                          {errors.message && touched.message && (
                            <Text textAlign={"start"} color={"#fc8181"}>
                              {errors.message}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl float="right">
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
                            Send Message
                          </Button>
                        </FormControl>
                      </VStack>
                    </form>
                  </Box>
                </Box>
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
