import { Button } from "@chakra-ui/react";
import { Link } from "wouter";

const LinkButton = ({ url, buttonText, ...rest }) => {
  return (
    <Link href={url}>
      <Button {...rest}>{buttonText}</Button>
    </Link>
  );
};

export default LinkButton;
