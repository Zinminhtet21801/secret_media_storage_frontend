import axios from "axios";
import { setRecoil } from "recoil-nexus";
import { userState } from "../atoms/atoms";
import { removeStoredUser } from "../user-storage";
const baseURL = import.meta.env.VITE_BASE_URL;

export function getJWTHeader(user) {
  return { Authorization: `Bearer ${user?.token}` };
}

export const AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  // headers: {
  //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
  // },
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error?.response;
    if (status === 401) {
      // if the user is not logged in, then redirect to the login page
      setRecoil(userState, {
        email: "",
        fullName: "",
      });
      removeStoredUser();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);
