import { create } from "zustand";

export const useAuth = create((set) => ({
  //  State Variables
  isLoggedIn: false,
  user: null,
  loading: true,

  // 1. App initialization handshake status update karne ke liye (App.js me use hoga)
  setSession: (userData) => {
    // 🪵 Log user details during initialization
    // console.log("🪵   Zustand [setSession] => Updating user details:", userData);

    if (userData) {
      set({ isLoggedIn: true, user: userData, loading: false });
    } else {
      set({ isLoggedIn: false, user: null, loading: false });
    }
  },

  // 2. Loading explicit state trigger
  setLoading: (status) => set({ loading: status }),

  // 3. Login Action
  login: (userData) => {
    // 🪵 Log user details right after successful login hit
    // console.log(
    //   "🪵 Zustand [login action] => User logged in successfully:",
    //   userData,
    // );

    set({ isLoggedIn: true, user: userData, loading: false });
  },

  // 4. Logout Action
  logout: () => {
    console.log(
      "🪵 Zustand [logout action] => Clearing user state from memory.",
    );
    set({ isLoggedIn: false, user: null, loading: false });
  },
}));
