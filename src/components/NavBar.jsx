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
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import LogoImage from "../assets/images/logo.png";
import { useAuth } from "../components/hooks/useAuth";
import { useUser } from "../components/hooks/useUser";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getStoredUser } from "../user-storage";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useUser();
  const [location, setLocation] = useLocation();
  const { signOut } = useAuth();

  useEffect(() => {
    if (getStoredUser()?.email) {
      const storedUserEmail = getStoredUser()?.email;
      if (storedUserEmail && location.includes("home")) return;
      if (storedUserEmail && !location.includes("home"))
        setLocation("/home/image/1");
    } else if (location.includes("home") ) setLocation("/");
  }, [location, user?.email]);

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
              onClick={() => setLocation("/")}
              // onClick={getProfile}
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
                    w={0}
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
                    <MenuItem onClick={signOut}>Logout</MenuItem>
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
