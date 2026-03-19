import axios from "axios";

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5009/api",
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5008/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ only this

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data, // ✅ important
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
