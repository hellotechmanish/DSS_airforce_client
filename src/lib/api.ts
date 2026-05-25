import axios from "axios";

import {
  holdRequestUntilReconnect,
  isServerUnavailableError,
  markServerAvailable,
  markServerUnavailable,
} from "./serverConnection";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  timeout: 15000,
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    markServerAvailable();

    return response.data;
  },

  (error) => {
    if (isServerUnavailableError(error)) {
      markServerUnavailable(error);

      return holdRequestUntilReconnect();
    }

    console.error("API Error:", error.message);

    if (error.response?.status === 401) {
      localStorage.clear();

      window.location.href = "/signin";
    }

    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
