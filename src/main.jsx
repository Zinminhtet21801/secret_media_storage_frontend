import {
  ChakraProvider,
  createStandaloneToast,
  extendTheme,
} from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";
import { queryClient } from "./react-query/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import RecoilNexus from "recoil-nexus";

let container = null;

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
};

const { ToastContainer } = createStandaloneToast();

const theme = extendTheme({ breakpoints });

export const baseURL = import.meta.env.VITE_BASE_URL;
export const s3ObjURL = import.meta.env.VITE_S3_OBJECT_URL;

document.addEventListener("DOMContentLoaded", (event) => {
  if (!container) {
    container = document.getElementById("root");
    const root = createRoot(container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <RecoilNexus />
          <ChakraProvider theme={theme}>
            <App />
            <ToastContainer />
          </ChakraProvider>
        </RecoilRoot>
        <ReactQueryDevtools />
      </QueryClientProvider>
    );
  }
});
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <QueryClientProvider client={queryClient}>
//     <RecoilRoot>
//       <ChakraProvider theme={theme}>
//         <App />
//         <ToastContainer />
//       </ChakraProvider>
//     </RecoilRoot>
//     <ReactQueryDevtools />
//   </QueryClientProvider>
// );
