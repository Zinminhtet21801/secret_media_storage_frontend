import { atom } from "recoil";

export const userState = atom({
  key: "login",
  default: {
    email: "",
    fullName: "",
  },
});

export const searchState = atom({
  key: "search",
  default: {
    term: "",
    submitClicked: false,
    currentPage: 1,
    searchItems: [],
    total: 0,
    isLoading: false,
    refetch: false,
  },
});
