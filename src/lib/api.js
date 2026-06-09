import axios from "axios";
import {
  holdRequestUntilReconnect,
  isServerUnavailableError,
  markServerAvailable,
  markServerUnavailable,
} from "./serverConnection";

// env file mendatory for fething url
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5009/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); //  only this

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

    // console.error("API Error:", error.message);
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error.response?.data || error.message);

    // return Promise.resolve({
    //   success: false,
    //   data: null,
    //   error: error.response?.data || error.message,
    // });
  },
);

// api.interceptors.response.use(
//   (response) => {
//     return {
//       success: true,
//       data: response.data,
//     };
//   },
//   (error) => {
//     console.error("API Error:", error.message);

//     if (error.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = "/signin";
//     }

//     return Promise.resolve({
//       success: false,
//       data: null,
//       error: error.response?.data || error.message,
//     });
//   }
// );

export default api;
