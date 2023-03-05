import { memo } from "react";
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
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useMutation } from "react-query";
import Pagination from "rc-pagination";
import "../assets/pagination.styles.less";
import useSearchItems from "./hooks/useSearchItems";
import itemRender from "../utils/paginationRenderItems";
import { downloadMedia, removeMedia } from "../utils/manageMedia";
import { useQueryClient } from "react-query";
import ConfirmAlertDialog from "./AlertDialog";
import { useResetRecoilState } from "recoil";
import { searchState } from "../atoms/atoms";

function SearchDrawer({ isOpen, onClose }) {
  const resetSearchState = useResetRecoilState(searchState);
  const {
    total,
    currentPage,
    setCurrentPage,
    handleSubmit,
    setTerm,
    handleChange,
    term,
    disableElement,
    handleSubmitClicked,
    isLoading,
    refetchData,
    searchItems,
  } = useSearchItems();

  const drawerCloseCallback = () => {
    onClose();
    resetSearchState();
  };

  return (
    <>
      <Drawer onClose={drawerCloseCallback} isOpen={isOpen} size={"full"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Media</DrawerHeader>
          <DrawerBody>
            <DrawerBodyHeader
              handleSubmit={handleSubmit}
              setTerm={setTerm}
              handleChange={handleChange}
              term={term}
              disableElement={disableElement}
              handleSubmitClicked={handleSubmitClicked}
            />
            <Divider py={2} my={2} />
            <DrawerBodyContent
              isLoading={isLoading}
              searchItems={searchItems}
              total={total}
              term={term}
              refetchData={refetchData}
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
  handleSubmitClicked,
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
          onClick={() => handleSubmitClicked((prev) => !prev)}
        />
      </HStack>
    </form>
  );
};

const RenderSearchItems = ({
  searchItems,
  isLoading,
  total,
  term,
  refetchData,
}) => {
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

  return searchItems?.map(({ id, name, type: category }) => {
    return (
      <Card
        direction={{ base: "column", sm: "column", md: "row" }}
        key={id}
        mt={2}
        _hover={{ cursor: "pointer" }}
        variant="elevated"
        colorScheme={"pink"}
      >
        <CardBody noOfLines={1}>
          <Text isTruncated>{name}</Text>
        </CardBody>
        <CardFooter justify="space-between" flexWrap="wrap" gap={2}>
          <RemoveButton
            id={id}
            category={category}
            term={term}
            refetchData={refetchData}
          />
          <DownloadButton id={id} name={name} category={category} />
        </CardFooter>
      </Card>
    );
  });
};

const RemoveButton = ({ id, category, refetchData }) => {
  const queryClient = useQueryClient();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { data, mutate: mutateRemoveMedia } = useMutation(
    () => removeMedia(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("itemsQuantity");
        // queryClient.refetchQueries("itemsQuantity");
        queryClient.invalidateQueries(["items", category]);
        refetchData();
      },

      onError: (err) => {
        console.log(err);
      },
    }
  );

  const remove = () => {
    mutateRemoveMedia({ id: `${category}Items` });
  };

  return (
    <>
      <Button variant="solid" colorScheme="red" onClick={onOpen}>
        Remove
      </Button>
      {isOpen && (
        <ConfirmAlertDialog isOpen={isOpen} remove={remove} onClose={onClose} />
      )}
    </>
  );
};

const DownloadButton = ({ id, name, category }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: mutateDownloadMedia } = useMutation(
    () => downloadMedia(toast, name, category, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("itemsQuantity");
        // queryClient.refetchQueries("itemsQuantity");
        queryClient.invalidateQueries(["items", category]);
        // queryClient.refetchQueries(`${category}Items`);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const download = () => {
    mutateDownloadMedia({ id, category });
  };
  return (
    <Button
      variant="solid"
      colorScheme="teal"
      onClick={() => download(id, category)}
    >
      Download
    </Button>
  );
};

const DrawerBodyContent = ({
  isLoading,
  searchItems,
  total,
  term,
  refetchData,
}) => {
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
        term={term}
        refetchData={refetchData}
      />
    </>
  );
};

export default memo(SearchDrawer);
