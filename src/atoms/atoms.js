import { atom } from "recoil";

export const loginState = atom({
  key: "login",
  default: {
    email: "",
    fullName: "",
  },
});

export const progressState = atom({
  key: "progress",
  default: {
    progress: 0,
    title: "La Ou",
    description: "La Ou Srr",
  },
});
