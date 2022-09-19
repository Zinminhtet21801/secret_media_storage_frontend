import { Box, HStack } from "@chakra-ui/react";
import Compose from "../components/Compose";
// import {add} from "react-icons/all"
const Home = () => {
  return (
    <Box>
      <Box w={"80%"}>
        <HStack>
            <Compose />
        </HStack>
      </Box>
    </Box>
  );
};

export default Home;
