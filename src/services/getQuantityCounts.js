import axios from "axios";

import { baseURL } from "../main.jsx";

export const getQuantityCounts = async () => {
  console.log('getQuantityCounts 2')
  // write some codes to fetch items count from server
  try {
    const { data } = await axios.get(baseURL + "/media/getQuantity", {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};
