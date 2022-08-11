import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { progressState } from "../atoms/atoms";

const Toast = ({ title = "LOL", description = "dsfjl", progress = 0 }) => {
  const progressValue = useRecoilValue(progressState);
  console.log(progressValue, "progressValue");
  return (
    <Portal appendToParentPortal={false}>
      <HStack zIndex={500}>
        <ProgressCircle progress={progress} />
        <ProgressDetail title={title} description={description} />
      </HStack>
    </Portal>
  );
};

const ProgressDetail = ({ title, description }) => (
  <VStack>
    <Text>{title}</Text>
    <Text>{description}</Text>
  </VStack>
);

const ProgressCircle = ({ progress }) => (
  <CircularProgress value={progress}>
    <CircularProgressLabel>{progress}</CircularProgressLabel>
  </CircularProgress>
);

export default Toast;
