import type { AxiosRequestConfig } from "axios";
import api from "./api";

// ================= GET =================

export const GET = async <T = any>(
  url: string,
  params: Record<string, unknown> = {},
  config: AxiosRequestConfig = {},
) => {
  return api.get<T, T>(url, {
    params,
    ...config,
  });
};

// ================= POST =================

export const POST = (url: string, data: Record<string, unknown> = {}) => {
  return api.post(url, data);
};

// ================= PUT =================

export const PUT = (url: string, data: Record<string, unknown> = {}) => {
  return api.put(url, data);
};

// ================= DELETE =================

export const DELETE = (url: string) => {
  return api.delete(url);
};
