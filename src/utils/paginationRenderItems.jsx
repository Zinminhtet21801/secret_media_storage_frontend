import { Text } from "@chakra-ui/react";
import { Link } from "wouter";

const itemRender = (page, type, element, link, isLink = true) => {
  /* Rendering the page number. */
  if (type === "page") {
    return <Link to={isLink ? link : "#"}>{page}</Link>;
  }

  // write code for prev pagination
  if (type === "prev") {
    return (
      <div>
        <Link to={page > 0 && isLink ? link : ``}>
          <Text color={"white"}>Prev</Text>
        </Link>
      </div>
    );
  }

  // write code for next pagination
  if (type === "next") {
    return (
      <Link to={isLink ? link : "#"}>
        <Text color={"white"}>Next</Text>
      </Link>
    );
  }

  return element;
};

export default itemRender;
