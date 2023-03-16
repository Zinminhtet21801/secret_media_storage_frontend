import { useColorMode, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? (
        <MoonIcon aria-label="dark mode button" />
      ) : (
        <SunIcon aria-label="light mode button" />
      )}
    </Button>
  );
};

export default ThemeToggler;
