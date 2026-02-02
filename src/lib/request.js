import api from "./api";

export const GET = (url, params = {}) => api.get(url, { params });

export const POST = (url, data = {}) => api.post(url, data);

export const PUT = (url, data = {}) => api.put(url, data);

export const DELETE = (url) => api.delete(url);
