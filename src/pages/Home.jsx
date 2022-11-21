import { Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Compose from "../components/Compose";
// import {add} from "react-icons/all"
import { categories } from "../assets/Categories";
import { useQuery, useQueryClient } from "react-query";
import ItemBox from "../components/SquareItemBox";
import { getQuantityCounts } from "../services/getQuantityCounts";
import Logo from "../assets/images/logo.png";
const itemsCount = {
  audio: 0,
  image: 0,
  video: 0,
  others: 0,
};

const Home = () => {
  const queryClient = useQueryClient();
  console.log("====================================");
  console.log(queryClient, "JESUS");
  console.log("====================================");
  const query = useQuery("itemsQuantity", getQuantityCounts, {
    // refetchInterval: 1000
  });
  console.log(query, "HERES REACT QUERY");
  return (
    <Box m={2}>
      <HStack
        alignItems={"flex-start"}
        overflowX={["scroll", "scroll", "hidden", "hidden"]}
        scrollBehavior={"smooth"}
      >
        <Compose />
        <ShowCategories
          fetchQuantity={query.data}
          align={"horizontal"}
          separatorLine={false}
        />
      </HStack>

      {/* // show images */}
      <SimpleGrid columns={[1, 3, 5]} spacing={10} m={2} my={10}>
        <Box bg="tomato" height="300px">
          <img src={Logo} />
        </Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
        <Box bg="tomato" height="300px"></Box>
      </SimpleGrid>
    </Box>
  );
};

const ShowCategories = ({
  fetchQuantity = itemsCount,
  align = "horizontal",
  separatorLine = false,
}) => {
  console.log("====================================");
  console.log(fetchQuantity, "hello");
  console.log("====================================");
  const items = categories?.map((category, index) => (
    <ItemBox
      name={category.name}
      key={index}
      quantity={fetchQuantity[category.name.toLowerCase()]}
      align={align}
      separatorLine={separatorLine}
    />
  ));
  return items;
};

export default Home;
