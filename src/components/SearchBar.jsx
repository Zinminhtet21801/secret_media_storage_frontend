import { SearchIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { AxiosInstance } from "../axios/axiosInstance";
import SearchDrawer from "./SearchDrawer";

const SearchBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (isOpen) {
    return <SearchDrawer isOpen={isOpen} onClose={onClose} />;
  }
  return <IconButton type="submit" icon={<SearchIcon />} onClick={onOpen} />;
};

export default SearchBar;
