import api from "./api";
export const GET = async (url, params = {}) => {
  const res = await api.get(url, { params });
  return res;
};

export const POST = (url, data = {}) => api.post(url, data);

export const PUT = (url, data = {}) => api.put(url, data);

export const DELETE = (url) => api.delete(url);
