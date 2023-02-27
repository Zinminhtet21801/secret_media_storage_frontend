import { useLocation } from "wouter";
import { useUser } from "./hooks/useUser";
import { memo } from "react";
import { getStoredUser } from "../user-storage";

let total = 0;

const WithAuth = ({ children }) => {
  const { user } = useUser();
  getStoredUser()?.email;
  const [location, setLocation] = useLocation();
  if (!user?.email && !getStoredUser()?.email) {
    setLocation("/signin");
  }
  return children;
};

export default memo(WithAuth);
