import api from "./api";

// ✅ GET
export const GET = async (url, params = {}) => api.get(url, { params });

// ✅ POST
export const POST = (url, data = {}) => api.post(url, data);

// ✅ PUT
export const PUT = (url, data = {}) => api.put(url, data);

// ✅ DELETE
export const DELETE = (url) => api.delete(url);
