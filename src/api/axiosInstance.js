import axios from "axios";
import { FETCH_URL } from "../fetchIp";

const axiosInstance = axios.create({
  baseURL: FETCH_URL,
});

const reqInterceptor = axiosInstance.interceptors.request.use(
  (request) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    request.headers["Authorization"] = "Bearer " + userData.token;
    request.headers["Content-Type"] = "application/json";
    return request;
  },
  (error) => {}
);
export default axiosInstance;
