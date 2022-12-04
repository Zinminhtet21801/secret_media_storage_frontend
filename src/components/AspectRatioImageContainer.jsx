import { AspectRatio } from "@chakra-ui/react";

const AspectRatioImageContainer = ({ ratio, children }) => {
  return <AspectRatio ratio={ratio}>{children}</AspectRatio>;
};

export default AspectRatioImageContainer;
