import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

const { ToastContainer, toast } = createStandaloneToast();

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <ChakraProvider>
      <App />
      <ToastContainer />
    </ChakraProvider>
  </RecoilRoot>
);
