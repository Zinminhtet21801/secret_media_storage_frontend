import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import React from "react";

const MenuComponent = ({ children, colorScheme, ariaLabel, icon }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        colorScheme={colorScheme}
        aria-label={ariaLabel}
        icon={React.createElement(icon)}
      />

      <MenuList>{children}</MenuList>
    </Menu>
  );
};

export default MenuComponent;
