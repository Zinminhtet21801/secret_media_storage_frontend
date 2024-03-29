import axios from "axios";

import { baseURL } from "../main.jsx";

export const getCategoriesItems = async (url = "image", page = 1) => {
  // write some codes to fetch items count from server
  try {
    const { data } = await axios.get(
      baseURL + `/media/getCategories/${url}/page/${page}`,
      {
        // headers: {
        //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        // },
        withCredentials: true,
      }
    );
    return {
      data: data.data,
      hasMore: data.hasMore,
    };
  } catch (e) {
    console.log(e);
  }
};
