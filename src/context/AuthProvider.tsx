import { useState } from "react";

import { AuthContext } from "./AuthContext";
import type { UserType } from "../Types/type";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<UserType | null>(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData")!)
      : null,
  );

  const login = (token: string, userData: UserType) => {
    localStorage.setItem("token", token);

    localStorage.setItem("userData", JSON.stringify(userData));

    setToken(token);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userData");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,

        token,

        setToken,

        user,

        role: user?.role || null,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
