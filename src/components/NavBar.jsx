import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Center,
  Image,
} from "@chakra-ui/react";
import LogoImage from "../assets/images/logo.png";
import { useAuth } from "../components/hooks/useAuth";
import { useUser } from "../components/hooks/useUser";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getStoredUser } from "../user-storage";
import ThemeToggler from "./ThemeToggler";
import SearchBar from "./SearchBar";
import { useQueryClient } from "react-query";
import { AxiosInstance } from "../axios/axiosInstance";

export default function Nav() {
  const { user, refetchUser } = useUser();
  const [location, setLocation] = useLocation();
  const { signOut } = useAuth();
  const DUMMY_IMAGE_URL = "https://avatars.dicebear.com/api/male/username.svg";

  useEffect(() => {
    if (getStoredUser()?.email) {
      const storedUserEmail = getStoredUser()?.email;
      if (storedUserEmail && location.includes("home")) return;
      if (storedUserEmail && !location.includes("home"))
        setLocation("/home/image/1");
    } else if (getStoredUser()?.email) {
      console.log("refetching user");
      refetchUser();
    } else if (location.includes("home")) setLocation("/");
  }, [location, user?.email]);

  return (
    <>
      <Box minH={"5vh"} bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Logo LogoImage={LogoImage} setLocation={setLocation} />
          {/* {user.email && <SearchBar onSearch={onSearch} />} */}
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <SearchBar />
              <ThemeToggler />
              {user.email && (
                <Menu>
                  <AvatarMenuToggleButton imgUrl={DUMMY_IMAGE_URL} />
                  <UserMenuList
                    user={user}
                    imgUrl={DUMMY_IMAGE_URL}
                    signOut={signOut}
                  />
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

const Logo = ({ LogoImage, setLocation }) => {
  return (
    <Box>
      <Image
        src={LogoImage}
        height={10}
        width={10}
        borderRadius={"full"}
        _hover={{
          cursor: "pointer",
        }}
        alt="website logo"
        onClick={() => setLocation("/")}
        // onClick={getProfile}
      />
    </Box>
  );
};

const AvatarContainer = ({ size = "sm", imgUrl }) => (
  <Avatar size={size} src={imgUrl} />
);

const AvatarMenuToggleButton = ({ imgUrl }) => {
  return (
    <MenuButton
      as={Button}
      rounded={"full"}
      variant={"link"}
      cursor={"pointer"}
      w={0}
    >
      <AvatarContainer size={"sm"} imgUrl={imgUrl} />
    </MenuButton>
  );
};

const UserMenuList = ({ user, imgUrl, signOut }) => {
  return (
    <MenuList alignItems={"center"}>
      <br />
      <UserMenuHeader imgUrl={imgUrl} user={user} />
      <br />
      <MenuDivider />

      <UserMenuItem title="Account Settings" onClickHandler={null} />
      <UserMenuItem title={"Logout"} onClickHandler={signOut} />
    </MenuList>
  );
};

const UserMenuHeader = ({ imgUrl, user }) => {
  return (
    <>
      <Center>
        <AvatarContainer size={"2xl"} imgUrl={imgUrl} />
      </Center>
      <br />
      <Center>
        <p>{user.fullName}</p>
      </Center>
    </>
  );
};

const UserMenuItem = ({ title, onClickHandler }) => {
  return <MenuItem onClick={onClickHandler}>{title}</MenuItem>;
};
