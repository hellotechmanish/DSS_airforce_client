export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOTPASSWORD: "/auth/forgot-password",
  },
  USERS: {
    LIST: "/users",
    UPDATE: (id) => `/users/${id}`,
  },
};
