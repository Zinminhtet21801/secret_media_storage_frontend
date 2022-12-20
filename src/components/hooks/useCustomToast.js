import { useToast } from "@chakra-ui/react";

export function useCustomToast() {
  return useToast({
    isClosable: true,
    variant: "subtle",
    position: "bottom",
  });
}
