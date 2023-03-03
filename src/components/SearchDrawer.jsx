import {memo} from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  HStack,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Divider,
  Card,
  CardBody,
  Text,
  CardFooter,
  Button,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

import Pagination from "rc-pagination";
import "../assets/pagination.styles.less";
import useSearchItems from "./hooks/useSearchItems";
import itemRender from "../utils/paginationRenderItems";

function SearchDrawer({ isOpen, onClose }) {
  const {
    isLoading,
    searchItems,
    total,
    handleSubmit,
    setTerm,
    handleChange,
    term,
    disableElement,
    setSubmitClicked,
    currentPage,
    setCurrentPage,
  } = useSearchItems();

  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Media</DrawerHeader>
          <DrawerBody>
            <DrawerBodyHeader
              handleSubmit={handleSubmit}
              setTerm={setTerm}
              handleChange={handleChange}
              disableElement={disableElement}
              setSubmitClicked={setSubmitClicked}
              term={term}
            />
            <Divider py={2} my={2} />
            <DrawerBodyContent
              total={total}
              isLoading={isLoading}
              searchItems={searchItems}
            />
            <DrawerFooter>
              {total > 10 && (
                <Pagination
                  current={currentPage}
                  total={total}
                  onChange={(page) => {
                    setCurrentPage(page);
                    setTerm(term);
                  }}
                  showTotal={(total, range) =>
                    `${range[0]} - ${range[1]} of ${total} items`
                  }
                  itemRender={(page, type, element) =>
                    itemRender(
                      page,
                      type,
                      element,
                      `/home/search/${page}`,
                      false
                    )
                  }
                />
              )}
            </DrawerFooter>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const DrawerBodyHeader = ({
  handleSubmit,
  setTerm,
  handleChange,
  term,
  disableElement,
  setSubmitClicked,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <HStack>
        <InputGroup>
          <Input
            type="text"
            value={term}
            onChange={handleChange}
            placeholder="Type something to search"
          />
          <InputRightElement
            _hover={{
              cursor: disableElement(term) ? "pointer" : "not-allowed",
            }}
            children={
              <CloseIcon boxSize={3} opacity={disableElement(term) ? 1 : 0.5} />
            }
            onClick={() => setTerm("")}
          />
        </InputGroup>
        <IconButton
          type="submit"
          icon={<SearchIcon />}
          isDisabled={!disableElement(term)}
          onClick={() => setSubmitClicked((prev) => !prev)}
        />
      </HStack>
    </form>
  );
};

const RenderSearchItems = ({ searchItems, isLoading, total }) => {
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (total === 0) {
    return (
      <Flex justify="center" align="center" pt={20}>
        <Text>No results found</Text>
      </Flex>
    );
  }

  return searchItems?.map((item) => {
    return (
      <Card
        direction={{ base: "column", sm: "column", md: "row" }}
        key={item.id}
        mt={2}
        _hover={{ cursor: "pointer" }}
        variant="elevated"
        colorScheme={"pink"}
      >
        <CardBody noOfLines={1}>
          <Text isTruncated>{item.name}</Text>
        </CardBody>
        <CardFooter justify="space-between" flexWrap="wrap" gap={2}>
          <Button variant="solid" colorScheme="red">
            Remove
          </Button>
          <Button variant="solid" colorScheme="teal">
            Download
          </Button>
        </CardFooter>
      </Card>
    );
  });
};

const DrawerBodyContent = ({ total, searchItems, isLoading }) => {
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Text>Loading...</Text>
      </Flex>
    );
  }
  return (
    <>
      <RenderSearchItems
        isLoading={isLoading}
        searchItems={searchItems}
        total={total}
      />
    </>
  );
};

export default memo(SearchDrawer);
