import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export function getJWTHeader(user) {
  return { Authorization: `Bearer ${user?.token}` };
}

export const AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${document.cookie.split("=")[1]}`,
  },
});
