export const setStoredUser = (user) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const storedUser = sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const removeStoredUser = () => {
  sessionStorage.removeItem("user");
};
