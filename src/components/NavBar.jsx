import {
  Box,
  Flex,
  Avatar,
  // Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import LogoImage from "../assets/images/logo.png";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loginState } from "../atoms/atoms";
import { Link, useLocation } from "wouter";


const baseURL = import.meta.env.VITE_BASE_URL;

// const NavLink = ({ children }) => (
//   <Link
//     // px={2}
//     // py={1}
//     // rounded={"md"}
//     // _hover={{
//     //   textDecoration: "none",
//     //   bg: useColorModeValue("gray.200", "gray.700"),
//     // }}
//     href={"#"}
//   >
//     {children}
//   </Link>
// );

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useRecoilState(loginState);
  const [location, setLocation] = useLocation();

  

  const logout = async () => {
    if (document.cookie) {
      const res = await axios.get(`${baseURL}user/logout`, {
        withCredentials: true, // make sure to include this madafaka to clear the cookie
        headers: {
          Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });
      if (res.status === 200) {
        setUser((oldUser) => ({
          ...oldUser,
          fullName: "",
          email: "",
        }));
      }
    }
    setLocation("/");
  };

  const getProfile = async () => {
    if (document.cookie.split("=")[1]) {
      const res = await axios.get(`${baseURL}user/profile`, {
        headers: {
          Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });
      if (res.status === 200) {
        setUser((oldUser) => ({
          ...oldUser,
          fullName: res.data.fullName,
          email: res.data.email,
        }));
        if (location === "/") {
          return setLocation("/home");
        }
      }
    } else {
      setUser({
        fullName: "",
        email: "",
      });
      setLocation("/");
    }
  };

  useEffect(() => {
    getProfile();
  }, [user.email]);

  return (
    <>
      <Box minH={"5vh"} bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Image
              src={LogoImage}
              height={10}
              borderRadius={"full"}
              _hover={{
                cursor: "pointer",
              }}
              // onClick={() => setLocation("/")}
              onClick={getProfile}
            />
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              {user.email && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{user.fullName}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    {/* <NavLink> */}
                    {/* <MenuItem>Your Servers</MenuItem> */}
                    {/* </NavLink> */}
                    {/* <NavLink> */}
                    <MenuItem>Account Settings</MenuItem>
                    {/* </NavLink> */}
                    {/* <NavLink> */}
                    <MenuItem onClick={logout}>Logout</MenuItem>
                    {/* </NavLink> */}
                    {/* <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem> */}
                  </MenuList>
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
