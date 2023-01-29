import { useRecoilState } from "recoil";
import { AxiosInstance } from "../../axios/axiosInstance";
import { useLocation } from "wouter";
import { userState } from "../../atoms/atoms";
import { useCustomToast } from "./useCustomToast";
import { toastConfig } from "../../services/toastConfig";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import {
  setStoredUser,
  getStoredUser,
  removeStoredUser,
} from "../../user-storage";
let errorToastCount = 0;

async function getUserFromServer(user) {
  const source = axios.CancelToken.source();
  if (getStoredUser() === null) return user;
  const axiosResponse = await AxiosInstance.get("/user/profile", {
    cancelToken: source.token,
  });

  axiosResponse.cancel = () => {
    source.cancel();
  };

  return axiosResponse.data;
}

export const useUser = () => {
  const [user, setUser] = useRecoilState(userState);
  const [location, setLocation] = useLocation();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  useQuery("user", () => getUserFromServer(user), {
    // enabled: !!user?.email && location !== "/",
    // enabled: location.includes("home"),
    placeholderData: user,
    onSuccess: (axiosResponse) => {
      const { email, fullName } = axiosResponse;
      email && queryClient.invalidateQueries("itemsQuantity");
      email && queryClient.invalidateQueries([`items`]);
      setUser({
        fullName,
        email,
      });
    },
    onError: (error) => {
      setUser({
        email: "",
        fullName: "",
      });
      removeStoredUser();
      return;
    },
  });

  const authServerCall = async (urlEndpoint, method) => {
    try {
      const res = await AxiosInstance({
        url: urlEndpoint,
        method: method,
      });
      if (res.status === 200) {
        setUser((prevData) => ({
          ...prevData,
          fullName: res.data.fullName,
          email: res.data.email,
        }));
        if (location === "/") {
          return setLocation("/home");
        }
      } else {
        setUser({
          fullName: "",
          email: "",
          refreshToken: "",
        });
        setLocation("/");
      }
    } catch (e) {
      const { error, message, statusCode } = e.response.data;
      ++errorToastCount;
      const errorId = `SignInError${message}${errorToastCount}`;
      console.log(errorId);
      toast({
        id: errorId,
        duration: 3000,
        status: "error",
        position: "bottom-left",
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, "Sign in failed", message, null),
      });
    }
  };

  function updateUser(newUser) {
    const user = {
      fullName: newUser.fullName,
      email: newUser.email,
    };
    setUser(user);
    setStoredUser(user);
    queryClient.setQueryData("user", user);
  }

  function clearUser() {
    removeStoredUser();
    setUser({
      fullName: "",
      email: "",
    });
    setLocation("/");
  }

  return {
    user,
    updateUser,
    clearUser,
  };
};
