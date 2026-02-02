export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  USERS: {
    LIST: "/users",
    UPDATE: (id) => `/users/${id}`,
  },
};
