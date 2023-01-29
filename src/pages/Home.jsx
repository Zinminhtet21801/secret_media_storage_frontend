import {
  Box,
  HStack,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Menu,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import Compose from "../components/Compose";
import { categories } from "../assets/Categories";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ItemBox from "../components/SquareItemBox";
import { getQuantityCounts } from "../services/getQuantityCounts";
import { Link, useLocation } from "wouter";
import { getCategoriesItems } from "../services/getCategoriesItems";
import Pagination from "rc-pagination";
import "../assets/pagination.styles.less";
import { baseURL, s3ObjURL } from "../main";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import MenuComponent from "../components/MenuComponent";
import AspectRatioImageContainer from "../components/AspectRatioImageContainer";
import axios from "axios";
import { userState } from "../atoms/atoms";
import { useRecoilState } from "recoil";
import { toastConfig } from "../services/toastConfig";
import { getStoredUser } from "../user-storage";

const itemsCount = {
  audio: 0,
  image: 0,
  video: 0,
  others: 0,
};

let count = 0;

const itemRender = (current, type, element, category) => {
  /* Rendering the page number. */
  if (type === "page") {
    return <Link to={`/home/${category}/${current}`}>{current}</Link>;
  }

  // write code for prev pagination
  if (type === "prev") {
    return (
      <div>
        <Link to={current > 0 ? `/home/${category}/${current}` : ``}>
          <Text color={"white"}>Prev</Text>
        </Link>
      </div>
    );
  }

  // write code for next pagination
  if (type === "next") {
    return (
      <Link to={`/home/${category}/${current}`}>
        <Text color={"white"}>Next</Text>
      </Link>
    );
  }

  return element;
};

const Home = () => {
  /* Checking if the user is logged in or not. If the user is not logged in, it will return. */

  // if (!cookies.get("user")) return;

  // if(!document?.cookie.split("=")[1]) return;
  if (!getStoredUser()) return;

  const [location, setLocation] = useLocation();
  const [category, setCategory] = useState("image");
  const [user, setUser] = useRecoilState(userState);
  const queryClient = useQueryClient();

  // if (!document?.cookie.split("=")[1]) return;

  useEffect(() => {
    if (location === "/home" || location === "/home/") {
      setLocation("/home/image/1");
    }
  }, [location, category]);

  const setCategoryHandler = (categoryArg) => {
    setCategory(categoryArg);
    setLocation(`/home/${categoryArg}/1`);
  };

  // const category = location.split("/")[2] ? location.split("/")[2] : undefined;
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
          itemRender={(page, type, element) =>
            itemRender(page, type, element, category)
          }
        />
      )}
    </>
  );
};

const ItemNameAndIconContainer = ({ name, id, category }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const removeMedia = async () => {
    const res = await axios.delete(`${baseURL}/media/remove/${id}`, {
      // headers: {
      //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      // },
      withCredentials: true,
    });
    return res;
  };

  const downloadMedia = async () => {
    if (toast.isActive(name)) {
      count++;
      return toast({
        id: name + count,
        duration: 3000,
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, name, `${name} is already in queue.`, 100),
      });
    }

    toast({
      id: name,
      duration: 3000,
      status: "loading",
      render: ({ id, onClose }) =>
        toastConfig(id, onClose, name, `Downloading...`, 0),
    });
    const link = document.createElement("a");
    const res = await axios.get(`${baseURL}/media/download/${category}/${id}`, {
      // headers: {
      //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      // },
      withCredentials: true,
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        let pendingProgress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        if (pendingProgress === 100) {
          toast.update(name, {
            id: name,
            duration: 3000,
            status: "loading",
            render: ({ id, onClose }) =>
              toastConfig(id, onClose, name, `Completed!!!`, pendingProgress),
          });
        } else {
          toast.update(name, {
            id: name,
            duration: null,
            status: "loading",
            render: ({ id, onClose }) =>
              toastConfig(id, onClose, name, `Downloading...`, pendingProgress),
          });
        }
      },
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], {
        type: res.headers["content-type"],
      })
    );

    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);

    return res;
  };
  const { data, mutate: mutateRemoveMedia } = useMutation(removeMedia, {
    onSuccess: () => {
      queryClient.invalidateQueries("itemsQuantity");
      // queryClient.refetchQueries("itemsQuantity");
      queryClient.invalidateQueries(["items", category]);
      // queryClient.refetchQueries(`${category}Items`);
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: mutateDownloadMedia } = useMutation(downloadMedia, {
    onSuccess: () => {
      queryClient.invalidateQueries("itemsQuantity");
      // queryClient.refetchQueries("itemsQuantity");
      queryClient.invalidateQueries(["items", category]);
      // queryClient.refetchQueries(`${category}Items`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const download = () => {
    mutateDownloadMedia({ id, category });
  };

  const remove = () => {
    mutateRemoveMedia({ id: `${category}Items` });
  };

  return (
    <HStack p={2} justifyContent={"space-between"}>
      <Text whiteSpace={"nowrap"} textOverflow={"ellipsis"} overflow={"hidden"}>
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
            onClick={remove}
          >
            Remove
          </MenuItem>
        </MenuComponent>
      </Menu>
    </HStack>
  );
};

const ItemContainer = ({ id, children, height, width, bgColor }) => {
  return (
    <Box
      bg={bgColor}
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
    </Box>
  );
};

const ShowItems = ({ items, category, mail }) => {
  return (
    <>
      {items &&
        items.map(({ id, name, type }) => {
          return (
            <ItemContainer
              id={id}
              key={id}
              height={"fit-content"}
              bgColor={"gray.500"}
            >
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

const ShowCategories = ({
  fetchQuantity = itemsCount,
  align = "horizontal",
  separatorLine = false,
  setCategoryHandler,
}) => {
  const items = categories?.map((category, index) => (
    <ItemBox
      name={category.name}
      key={index}
      quantity={fetchQuantity[category.name.toLowerCase()]}
      align={align}
      separatorLine={separatorLine}
      setCategoryHandler={setCategoryHandler}
    />
  ));
  return items;
};

export default Home;
