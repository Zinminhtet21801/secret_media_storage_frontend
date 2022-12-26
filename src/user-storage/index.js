export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const removeStoredUser = () => {
  localStorage.removeItem("user");
};
