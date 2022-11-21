import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

const { ToastContainer, toast } = createStandaloneToast();

export const baseURL = import.meta.env.VITE_BASE_URL;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <ChakraProvider>
        <App />
        <ToastContainer />
      </ChakraProvider>
    </RecoilRoot>
  </QueryClientProvider>
);
