import { create } from "zustand";

export const useAuth = create((set) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  return {
    isLoggedIn: !!storedToken && !!storedUser,
    user: storedUser ? JSON.parse(storedUser) : null,

    login: (user, token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ isLoggedIn: true, user });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isLoggedIn: false, user: null });
    },
  };
});
export const getUser = () => {
  try {
    const data = localStorage.getItem("userData");

    if (!data) return null;

    const parsed = JSON.parse(data);

    return parsed.user; // yaha se direct user object mil jayega
  } catch (error) {
    console.error("User parse error:", error);
    return null;
  }
};
