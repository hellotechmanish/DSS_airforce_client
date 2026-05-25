import { Suspense, useState } from "react";

import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

import "./App.css";

import { AuthContext } from "./context/AuthContext";
import { type UserType } from "./Types/type";

function App() {
  const storedData = JSON.parse(localStorage.getItem("userData") || "null");

  const savedToken = localStorage.getItem("token");

  const [token, setToken] = useState<string | null>(savedToken || null);

  const [user, setUser] = useState<UserType | null>(storedData?.user ?? null);

  const [role, setRole] = useState<string | null>(
    storedData?.user?.role ?? null,
  );

  const isLoggedIn = Boolean(token);

  const login = (token: string, userData: UserType) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        user: userData,
      }),
    );

    setToken(token);

    setUser(userData);

    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userData");

    setToken(null);

    setUser(null);

    setRole(null);
  };

  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TailSpin height={80} width={80} color="#2563eb" />
        </div>
      }
    >
      <AuthContext.Provider
        value={{
          token,
          setToken,
          user,
          role,
          isLoggedIn,
          login,
          logout,
        }}
      >
        <Toaster position="bottom-right" />

        <Outlet />
      </AuthContext.Provider>
    </Suspense>
  );
}

export default App;
