import axios from "axios";
import { FETCH_URL } from "../fetchIp";
import {
  holdRequestUntilReconnect,
  isServerUnavailableError,
  markServerAvailable,
  markServerUnavailable,
} from "../lib/serverConnection";

const axiosInstance = axios.create({
  baseURL: FETCH_URL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (request) => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData?.token) {
      request.headers["Authorization"] = "Bearer " + userData.token;
    }

    request.headers["Content-Type"] = "application/json";
    return request;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    markServerAvailable();
    return response;
  },
  (error) => {
    if (isServerUnavailableError(error)) {
      markServerUnavailable(error);
      return holdRequestUntilReconnect();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
