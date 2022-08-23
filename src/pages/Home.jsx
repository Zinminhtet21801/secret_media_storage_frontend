import { Box, HStack } from "@chakra-ui/react";
import Compose from "../components/Compose";
import Compose1 from "../components/Compose1";
// import {add} from "react-icons/all"
const Home = () => {
  return (
    <Box>
      <Box w={"80%"}>
        <HStack>
            <Compose1 />
        </HStack>
      </Box>
    </Box>
  );
};

export default Home;
