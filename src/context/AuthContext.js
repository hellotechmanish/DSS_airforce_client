// import React, { useContext } from "react";
// export const AuthContext = React.createContext({
//   isLoggedIn: false,
//   user: null,
//   token: null,
//   login: () => {},
//   logout: () => {},
// });

// export function useAuth() {
//   return useContext(AuthContext);
// }

import React, { createContext, useContext, useState } from "react";

// export const AuthContext = createContext(null);

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const Authcontext = () => useContext(AuthContext);
