import { useEffect, useCallback } from "react";
import { AxiosInstance } from "../../axios/axiosInstance";
import { useRecoilState } from "recoil";
import { searchState } from "../../atoms/atoms";

const useSearchItems = () => {
  const [search, setSearch] = useRecoilState(searchState);

  const handleChange = (event) => {
    setSearch((prev) => ({
      ...prev,
      term: event.target.value,
    }));
  };

  const setTerm = (text) => {
    setSearch((prev) => ({
      ...prev,
      term: text,
    }));
  };

  const handleSubmitClicked = (bool) => {
    setSearch((prev) => ({
      ...prev,
      submitClicked: bool,
    }));
  };

  const disableElement = (text) => {
    return text?.trim();
  };

  const setCurrentPage = (page) => {
    setSearch((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleSubmit = (event) => {
    const controller = new AbortController();
    event.preventDefault();
    const trimmedTerm = search.term.trim();
    trimmedTerm && onSearch(trimmedTerm, controller);
  };

  const refetchData = () => {
    setSearch((prev) => ({
      ...prev,
      refetch: !prev.refetch,
    }));
  };

  const onSearch = useCallback(
    async (keyword, controller) => {
      if (!keyword?.trim()) {
        return {
          data: [],
          length: 0,
        };
      }

      setSearch((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const { data } = await AxiosInstance({
          method: "GET",
          url: `/media/search`,
          params: {
            keyword,
            currentPage: search.currentPage,
          },
          signal: controller.signal,
        });

        setSearch((prev) => ({
          ...prev,
          searchItems: data.res,
          total: data.length,
          isLoading: false,
        }));
      } catch (e) {
        console.log(e);
      } finally {
        setSearch((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    },
    [search.term, search.currentPage, search.submitClicked]
  );

  useEffect(() => {
    const controller = new AbortController();
    try {
      const fetchItems = async () => {
        await onSearch(search.term, controller);
      };
      fetchItems();
    } catch (e) {
      console.log(e);
    }
    return () => {
      controller.abort();
    };
  }, [search.currentPage, search.refetch]);

  return {
    total: search.total,
    isLoading: search.isLoading,
    searchItems: search.searchItems,
    handleSubmit,
    term: search.term,
    setTerm,
    disableElement,
    handleChange,
    handleSubmitClicked,
    setCurrentPage,
    currentPage: search.currentPage,
    refetchData,
  };
};

export default useSearchItems;
