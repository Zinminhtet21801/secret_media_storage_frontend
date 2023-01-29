import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  CloseButton,
  Flex,
  Text,
} from "@chakra-ui/react";

function getProgress(progressValue) {
  if (progressValue === null) {
    return <CloseIcon color={"white"} fontSize={"40px"} />;
  } else if (progressValue === 100) {
    return <CheckCircleIcon color={"white"} fontSize={"40px"} />;
  } else {
    return (
      <Center>
        <CircularProgress value={progressValue}>
          <CircularProgressLabel>{progressValue}</CircularProgressLabel>
        </CircularProgress>
      </Center>
    );
  }
}

export function toastConfig(
  id,
  onClose,
  title,
  description,
  progressValue,
  uploader,
  cancelBtnVisibility = "hidden",
  fileName,
  handleRemoveFile
) {
  return (
    <Box position={"relative"} key={id}>
      <Flex
        alignItems={"center"}
        color={"white"}
        p={3}
        bgColor={
          progressValue === null
            ? "red.500"
            : progressValue === 100
            ? "green.500"
            : "blue.300"
        }
        rounded={"base"}
      >
        <Box padding={2}>{getProgress(progressValue)}</Box>
        <Flex direction="column">
          <Text
            fontSize="2xl"
            width={250}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {title}
          </Text>
          <Text>{description}</Text>
        </Flex>
        <CloseButton
          position={"absolute"}
          right={0}
          top={0}
          onClick={onClose}
        />
        <Text
          visibility={cancelBtnVisibility}
          onClick={() => {
            uploader.abort();
            handleRemoveFile(fileName);
            alert("Upload cancelled");
            onClose();
          }}
          style={{
            cursor: "pointer",
            marginTop: "auto",
          }}
        >
          Cancel
        </Text>
      </Flex>
    </Box>
  );
}
