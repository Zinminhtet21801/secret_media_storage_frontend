import {
  Box,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {
  techStackBackendItems,
  techStackFrontendItems,
} from "../assets/techStack";
import { usePalette } from "react-palette";

const TechStack = () => {
  return (
    <Box marginInline={5}>
      <Header title="🚀 Tech Stack" mt={5} marginBlock={5} />
      <RenderTechStackBody
        techStack={techStackFrontendItems}
        title={"Frontend"}
      />
      <RenderTechStackBody
        techStack={techStackBackendItems}
        title={"Backend"}
      />
    </Box>
  );
};

const RenderTechStackBody = ({ techStack, title }) => {
  return (
    <Box marginTop={10} mb={"16"}>
      <Header title={title} size={"lg"} textAlign={"left"} />
      <RenderItems techStack={techStack} />
    </Box>
  );
};

const RenderItems = ({ techStack }) => {
  return techStack.map((item) => {
    return (
      <Box key={item.title}>
        <Header title={item.title} size={"md"} />
        <TechStackBodyItems items={item.items} />
      </Box>
    );
  });
};

const TechStackBodyItems = ({ items }) => {
  return (
    <SimpleGrid spacing={10} marginBlock={5} columns={{ sm: 1, md: 2, lg: 5 }}>
      {items.map((item) => {
        return <Card key={item.language} item={item} />;
      })}
    </SimpleGrid>
  );
};

const Header = ({ title, ...rest }) => {
  return <Heading {...rest}>{title}</Heading>;
};

const Card = ({ item }) => {
  const { data, loading } = usePalette(item.image);
  return (
    <a target={"_blank"} href={item.link}>
      <HStack
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        p={5}
        bg={data.lightVibrant}
        _hover={{
          cursor: "pointer",
        }}
        margin={"auto"}
      >
        {loading ? (
          <Skeleton boxSize="50px" />
        ) : (
          <Image
            boxSize="50px"
            src={item.image}
            fallbackSrc="https://via.placeholder.com/150"
          />
        )}
        <Text
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          whiteSpace={"nowrap"}
          fontWeight="bold"
          fontSize="md"
          color={data.darkVibrant}
        >
          {item.language}
        </Text>
      </HStack>
    </a>
  );
};

export default TechStack;
