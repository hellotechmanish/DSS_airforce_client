import axios from "axios";
import { useAuth } from "../context/useAuth"; // 👈 1. Zustand store import karein (path verify kar lein)
import {
  holdRequestUntilReconnect,
  isServerUnavailableError,
  markServerAvailable,
  markServerUnavailable,
} from "./serverConnection";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5009",
  timeout: 15000,
  withCredentials: true, //  CRITICAL FIX: Sends cookies automatically
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => {
    markServerAvailable();
    return response.data;
  },
  async (error) => {
    if (isServerUnavailableError(error)) {
      markServerUnavailable(error);
      return holdRequestUntilReconnect();
    }

    // ==================== 🔐 AUTO LOGOUT ON EXPIRY (16th MINUTE) ====================
    if (error.response?.status === 401) {
      console.warn(
        "Unauthorized API call intercepted. Session invalid or expired.",
      );

      const currentPath = window.location.pathname;

      //  Condition: Agar user pehle se login page ya root par hai, toh bypass karein.
      // Agar user dashboard ya kisi page par monitor kar raha hai aur tab 401 aaye:
      if (currentPath !== "/signIn" && currentPath !== "/") {
        console.log(
          "Active monitoring token expired. Executing auto-cleanup matrix.",
        );

        // A. Zustand store memory ko plain JS file se direct clear karein
        useAuth.getState().logout();

        // B. Clear local window frame and force safe redirect to portal
        window.location.href = "/signIn";
      }
    }

    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
