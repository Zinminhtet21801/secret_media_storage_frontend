import { AxiosInstance } from "../../axios/axiosInstance.js";
import { useCustomToast } from "./useCustomToast.js";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/atoms.js";
import { useLocation } from "wouter";
import { toastConfig } from "../../services/toastConfig.jsx";
import { useQueryClient } from "react-query";
import { useUser } from "./useUser.js";

let errorToastCount = 0;

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [location, setLocation] = useLocation();
  const toast = useCustomToast();
  const queryClient = useQueryClient();
  const SERVER_ERROR = "There was an error contacting the server.";
  const { updateUser, clearUser } = useUser();
  const authServerCall = async (urlEndpoint, formActions, restCredential) => {
    try {
      const { data, status } = await AxiosInstance({
        url: urlEndpoint,
        method: "POST",
        data: {
          ...restCredential,
        },
      });

      if (status === 201 || status === 200) {
        formActions.resetForm();
        setUser((prevData) => ({
          ...prevData,
          fullName: data.fullName,
          email: data.email,
        }));
        queryClient.setQueryData("user", {
          email: data.email,
          fulName: data.fullName,
        });
        updateUser(data);
        setLocation("/home");
      }

      // if (status === 400) {
      //   const title = "message" in data ? data.message : "Unauthorized";
      //   toast({
      //     title,
      //     status: "warning",
      //   });
      // }
    } catch (e) {
      // const title =
      //   axios.isAxiosError(error) && error?.response?.data?.message
      //     ? error?.response?.data?.message
      //     : SERVER_ERROR;

      // toast({
      //   title,
      //   status: "error",
      // });

      const { error, message, statusCode } = e?.response?.data;
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

  /**
   * A function that takes in two parameters, formActions and credentials. It then calls the
   * authServerCall function with the parameters "/user/login", formActions, email, and password.
   * @param formActions - This is the formActions object that is passed to the form component.
   * @param credentials - an object containing the email and password
   */
  const signIn = async (formActions, credentials) => {
    authServerCall("/user/login", formActions, credentials);
  };

  /**
   * It takes in the formActions and credentials, and then calls the authServerCall function with the
   * url, formActions, email, password, and fullName
   * @param formActions - This is the formActions object that is passed to the form component.
   * @param credentials - an object with the following properties:
   */
  const signUp = async (formActions, credentials) => {
    authServerCall("/user/create", formActions, credentials);
  };

  /**
   * It clears the user from cookies and then displays a toast message
   */
  const signOut = async () => {
    try {
      const res = await AxiosInstance({
        url: "/user/logout",
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        // },
      });

      queryClient.removeQueries({
        queryKey: "user",
      });

      queryClient.removeQueries({
        queryKey: ["items"],
      });

      queryClient.removeQueries("itemsQuantity");

      if (res.status === 200) {
        toast({
          title: "Logged out",
          status: "info",
        });
        clearUser();
      }
    } catch (e) {
      console.log(e);
    }

    setLocation("/");
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
