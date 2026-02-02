// Import Server Component
import React, { useState, useEffect } from "react";
import { Suspense, memo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Import Custom Component Attribute
import "./App.css";
import { AdminContext } from "./context/AdminContext";
import { AuthContext } from "./context/AuthContext";
import LoaderDialog from "./views/component/loader";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = React.useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const storeData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    function checkUserData() {
      const access_token = localStorage.getItem("access_token");

      if (storeData) {
        setToken(access_token);
        setUser(storeData.user);
        setRole(storeData.user.userRole);
      }
    }
    checkUserData();
    window.addEventListener("storage", checkUserData);
    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, [token]);

  useEffect(() => {
    if (!storeData) {
      navigate("/signIn");
    }
    if (location.pathname === "/") {
      navigate("/signIn");
    }
  }, [navigate]);

  return (
    <Suspense fallback={<LoaderDialog loading={true} />}>
      <AuthContext.Provider value={{ token, setToken, user, role }}>
        <AdminContext.Provider>
          <Outlet />
        </AdminContext.Provider>
      </AuthContext.Provider>
    </Suspense>
  );
}

export default memo(App);
