import { useRecoilState } from "recoil";
import { AxiosInstance } from "../../axios/axiosInstance";
import { useLocation } from "wouter";
import { userState } from "../../atoms/atoms";
import { useCustomToast } from "./useCustomToast";
import { toastConfig } from "../../services/toastConfig";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

let errorToastCount = 0;

async function getUserFromServer(user) {
  const source = axios.CancelToken.source();
  if (!user) return null;
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
    enabled: !!user.email,
    onSuccess: (axiosResponse) => {
      const { email, fullName } = axiosResponse;
      setUser({
        fullName,
        email,
      });
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
    setUser(newUser);
    queryClient.setQueryData("user", newUser);
  }

  function clearUser() {
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
