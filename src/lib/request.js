import api from "./api";

//    GET METHOD
// Automatically forwards configuration query params directly to axios core
export const GET = async (url, params = {}) => {
  const response = await api.get(url, { params });
  return response; // Returns the parsed response.data from interceptor smoothly
};

//    POST METHOD
export const POST = async (url, data = {}) => {
  const response = await api.post(url, data);
  return response;
};

//    PUT METHOD
export const PUT = async (url, data = {}) => {
  const response = await api.put(url, data);
  return response;
};

//    DELETE METHOD
export const DELETE = async (url) => {
  const response = await api.delete(url);
  return response;
};
