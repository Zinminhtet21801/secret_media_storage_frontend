import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

function ItemBox({ name, quantity, align, separatorLine }) {
  return (
    <Box borderWidth={1} p={3} _hover={{ cursor: "pointer" }}>
      <AlignDiv align={align}>
        <Text w={50} textAlign={"left"}>
          {name}
        </Text>
        {separatorLine ? <Divider orientation='vertical' color={'whiteAlpha.50'} width={2} height={'16'} /> : <Divider />}
        <Text>{quantity}</Text>
      </AlignDiv>
    </Box>
  );
}

function AlignDiv({ children, align }) {
  return align === "horizontal" ? (
    <HStack alignItems={"center"}>{children}</HStack>
  ) : (
    <VStack alignItems={"center"}>{children}</VStack>
  );
}


export default ItemBox;
