import { Flex, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { HomePageSVG } from "../assets/svgs/homepage";
import LinkButton from "../components/LinkButton";

export default function Landing() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        paddingTop={{ base: 20, md: 10 }}
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
          <LinkButton
            url={"/signup"}
            key={"/signup"}
            buttonText={"Get started"}
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
            _hover={{ bg: "orange.500" }}
          />
          <LinkButton
            key={"Tech Stack"}
            buttonText={"Tech Stack"}
            url={"/techStack"}
            rounded={"full"}
            px={6}
          />
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
