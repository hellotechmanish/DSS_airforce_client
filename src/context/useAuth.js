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
