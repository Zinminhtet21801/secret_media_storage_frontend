import { SearchIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import SearchDrawer from "./SearchDrawer";

const SearchBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (isOpen) {
    return <SearchDrawer isOpen={isOpen} onClose={onClose} />;
  }
  return (
    <IconButton
      type="submit"
      icon={<SearchIcon />}
      onClick={onOpen}
      aria-label="search icon"
    />
  );
};

export default SearchBar;
