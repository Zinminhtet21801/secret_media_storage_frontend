import { useState, useEffect } from "react";
import { AxiosInstance } from "../../axios/axiosInstance";

const useSearchItems = () => {
  const [searchItems, setSearchItems] = useState([]);
  const [term, setTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const disableElement = (text) => {
    return text?.trim();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTerm = term.trim();
    trimmedTerm && onSearch(trimmedTerm);
  };

  const onSearch = async (keyword) => {
    if (!keyword.trim()) {
      return {
        data: [],
        length: 0,
      };
    }
    setIsLoading(true);
    try {
      const items = await AxiosInstance({
        method: "GET",
        url: `/media/search`,
        params: {
          keyword,
          currentPage,
        },
      });

      return items;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timeout;
    // setIsLoading(true);

    timeout = setTimeout(async () => {
      const fetchItems = async () => {
        const { data } = await onSearch(term);
        setSearchItems(data.res);
        setTotal(data.length);
      };
      fetchItems();
    }, 1000);

    const fetchItems = async () => {
      const { data } = await onSearch(term);
      setSearchItems(data.res);
      setTotal(data.length);
    };
    fetchItems();

    // setIsLoading(false);

    return () => {
      clearTimeout(timeout);
    };
  }, [submitClicked, currentPage]);

  return {
    total,
    isLoading,
    searchItems,
    handleSubmit,
    term,
    setTerm,
    disableElement,
    handleChange,
    setSubmitClicked,
    setCurrentPage,
    currentPage,
  };
};

export default useSearchItems;
