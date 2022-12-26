import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  // Link,
} from "@chakra-ui/react";
import { Link } from "wouter";
import { HomePageSVG } from "../assets/svgs/homepage";

export default function Landing() {

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Storing data{" "}
          <Text as={"span"} color={"orange.400"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Never burden your device's storage. Never be late for environmental
          care too. Keep track of your data. Store your everyting.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Link
            href="/signup"
            // _hover={{
            //   textDecoration: "none",
            // }}
          >
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
            >
              Get started
            </Button>
          </Link>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Illustration
            height={{ sm: "24rem", lg: "28rem" }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </Stack>
    </Container>
  );
}

export const Illustration = (props) => {
  return <HomePageSVG props={props} />;
};
