import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={term} onChange={handleChange} />
      <IconButton type="submit" icon={<SearchIcon />} />
    </form>
  );
};

export default SearchBar;
