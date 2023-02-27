import { memo } from "react";
import { categories } from "../assets/Categories";
import itemsCount from "../assets/itemsCount";
import ItemBox from "../components/SquareItemBox";

const ShowCategories = ({
  fetchQuantity = itemsCount,
  align = "horizontal",
  separatorLine = false,
  setCategoryHandler,
}) => {
  const items = categories?.map((category, index) => (
    <ItemBox
      name={category.name}
      key={index}
      quantity={fetchQuantity[category.name.toLowerCase()]}
      align={align}
      separatorLine={separatorLine}
      setCategoryHandler={setCategoryHandler}
    />
  ));
  return items;
};

export default memo(ShowCategories);
