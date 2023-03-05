import {
  HStack,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Menu,
  MenuItem,
  useToast,
  useDisclosure,
  Card,
} from "@chakra-ui/react";
import Compose from "../components/Compose";
import ShowCategories from "../components/ShowCategories";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getQuantityCounts } from "../services/getQuantityCounts";
import { useLocation } from "wouter";
import { getCategoriesItems } from "../services/getCategoriesItems";
import Pagination from "rc-pagination";
import "../assets/pagination.styles.less";
import { s3ObjURL } from "../main";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState, memo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import MenuComponent from "../components/MenuComponent";
import AspectRatioImageContainer from "../components/AspectRatioImageContainer";
import { userState } from "../atoms/atoms";
import { useRecoilState } from "recoil";
import { getStoredUser } from "../user-storage";
import ConfirmAlertDialog from "../components/AlertDialog";
import itemRender from "../utils/paginationRenderItems";
import { downloadMedia, removeMedia } from "../utils/manageMedia";

const itemsCount = {
  audio: 0,
  image: 0,
  video: 0,
  others: 0,
};

let count = 1;

const Home = () => {
  //TODO: make home component a memoized component to prevent unnecessary re-renders.
  // console.log("Home component rendered", count++);
  /* Checking if the user is logged in or not. If the user is not logged in, it will return. */
  if (!getStoredUser()) return;

  const [location, setLocation] = useLocation();
  const [category, setCategory] = useState("image");
  const [user, setUser] = useRecoilState(userState);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (location === "/home" || location === "/home/") {
      setLocation("/home/image/1");
    }
  }, [location, category]);

  const setCategoryHandler = (categoryArg) => {
    setCategory(categoryArg);
    setLocation(`/home/${categoryArg}/1`);
  };

  const pageNumber = location.split("/")[3]
    ? Number(location.split("/")[3])
    : 1;

  const { data: quantity } = useQuery("itemsQuantity", getQuantityCounts, {
    // enabled: !!user?.email,
    // refetchInterval: 1000
    placeholderData: itemsCount,
  });

  const {
    data: categoriesItems,
    isFetching,
    isLoading,
  } = useQuery(
    [`items`, category, pageNumber],
    () => getCategoriesItems(category, pageNumber),
    {
      // enabled: !!user?.email,
      // refetchInterval: 1000
      // keepPreviousData: true,
    }
  );

  useEffect(() => {
    setCategory(location.split("/")[2] ? location.split("/")[2] : undefined);
  }, [location]);

  useEffect(() => {
    if (categoriesItems?.hasMore && category !== null) {
      queryClient.prefetchQuery([`items`, category, pageNumber + 1], () =>
        getCategoriesItems(category, pageNumber + 1)
      );
    }
  }, [categoriesItems, category, pageNumber, quantity, queryClient]);

  return (
    <>
      {/* A horizontal stack that is aligning the compose component and the show categories component.  */}
      <HStack
        alignItems={"flex-start"}
        overflowX={["scroll", "scroll", "hidden", "hidden"]}
        scrollBehavior={"smooth"}
        m={2}
        p={1}
      >
        <Compose category={category} />

        {/* Rendering the categories and the quantity of items in each category. */}
        <ShowCategories
          fetchQuantity={quantity}
          align={"horizontal"}
          separatorLine={false}
          setCategoryHandler={setCategoryHandler}
        />
      </HStack>

      <Flex m={2} minHeight={"70vh"} justifyContent={"center"}>
        {/* A grid that will show 1 column on mobile, 3 columns on tablet and 5 columns on desktop. */}
        {!isLoading ? (
          categoriesItems?.data?.length > 0 ? (
            <SimpleGrid
              columns={[1, 1, 3, 3, 3, 5]}
              spacing={10}
              m={2}
              my={10}
              maxWidth={"100vw"}
            >
              <ShowItems
                items={categoriesItems?.data}
                category={category}
                mail={user.email}
              />
            </SimpleGrid>
          ) : (
            <Text mt={20}>No items found</Text>
          )
        ) : (
          <Spinner alignSelf={"center"} />
        )}
      </Flex>

      {/* Checking if the quantity is greater than 10, if it is, it will render the pagination component. */}
      {quantity && quantity[category] > 10 && (
        <Pagination
          current={pageNumber}
          total={quantity[category]}
          onChange={(page) => {
            setLocation(`/home/${category}/${page}`);
          }}
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`
          }
          itemRender={
            (page, type, element) =>
              itemRender(page, type, element, `/home/${category}/${page}`, true) // page, type, element, link
          }
        />
      )}
    </>
  );
};

const ItemNameAndIconContainer = ({ name, id, category }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, mutate: mutateRemoveMedia } = useMutation(
    () => removeMedia(id),
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

  const remove = () => {
    mutateRemoveMedia({ id: `${category}Items` });
  };

  return (
    <>
      <HStack p={2} justifyContent={"space-between"}>
        <Text
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
        >
          {name}
        </Text>
        <Menu>
          <MenuComponent
            ariaLabel={"General options"}
            colorScheme={"gray"}
            icon={BsThreeDotsVertical}
          >
            <MenuItem
              key={`download-menu-item-${id}`}
              aria-label="Download"
              onClick={download}
            >
              Download
            </MenuItem>
            <MenuItem
              key={`remove-menu-item-${id}`}
              aria-label="Remove"
              onClick={onOpen}
            >
              Remove
            </MenuItem>
          </MenuComponent>
        </Menu>
      </HStack>
      {isOpen && (
        <ConfirmAlertDialog isOpen={isOpen} remove={remove} onClose={onClose} />
      )}
    </>
  );
};

const ItemContainer = ({ id, children, height, width }) => {
  return (
    <Card
      height={height}
      key={id}
      width={width}
      _hover={{
        cursor: "pointer",
        // transform: "scale(1.1)",
        // transition: "transform 1.05s ease-in-out",
      }}
    >
      {children}
    </Card>
  );
};

const ShowItems = ({ items, category, mail }) => {
  return (
    <>
      {items &&
        items.map(({ id, name, type }) => {
          return (
            <ItemContainer id={id} key={id} height={"fit-content"}>
              {type === "image" && (
                <AspectRatioImageContainer ratio={4 / 3}>
                  <Image
                    alt={name}
                    // src={`${baseURL}/uploads/${mail}/${type}/${media}`}
                    src={`${s3ObjURL}/${mail}/${type}/${name}`}
                    width={300}
                  />
                </AspectRatioImageContainer>
              )}
              <ItemNameAndIconContainer
                name={name}
                id={id}
                category={category}
              />
            </ItemContainer>
          );
        })}
    </>
  );
};

export default memo(Home);
