// // Import Server Component
// import React, { useState, useEffect } from "react";
// import { Suspense, memo } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";

// // Import Custom Component Attribute
// import "./App.css";
// import { AdminContext } from "./context/AdminContext";
// import { AuthContext } from "./context/AuthContext";
// import LoaderDialog from "./views/component/loader";

// function App() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkUserData = () => {
//       const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
//       const savedToken = localStorage.getItem("token");

//       if (storedData?.user && savedToken) {
//         setToken(savedToken);
//         setUser(storedData.user);
//         setRole(storedData.user.role);
//       } else {
//         setToken(null);
//         setUser(null);
//         setRole(null);
//       }
//     };

//     checkUserData();
//     window.addEventListener("storage", checkUserData);

//     return () => {
//       window.removeEventListener("storage", checkUserData);
//     };
//   }, []);

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
//     const savedToken = localStorage.getItem("token");

//     // 🔴 Not logged in
//     if (!storedData?.user || !savedToken) {
//       if (location.pathname !== "/signIn") {
//         navigate("/signIn");
//       }
//     }

//     // 🟢 Logged in → block signIn
//     if (storedData?.user && savedToken) {
//       if (location.pathname === "/signIn") {
//         navigate("/resistence-monitoring");
//       }
//     }
//   }, [location, navigate]);

//   return (
//     <Suspense fallback={<LoaderDialog loading={true} />}>
//       {/* <AuthContext.Provider value={{ token, setToken, user, role }}> */}
//       {/* <AdminContext.Provider value={{}}> */}
//       <Outlet />
//       {/* </AdminContext.Provider> */}
//       {/* </AuthContext.Provider> */}
//     </Suspense>
//   );
// }

// export default memo(App);

import React, { useState, useEffect, Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import LoaderDialog from "./views/component/loader";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
    const savedToken = localStorage.getItem("token");

    if (storedData?.user && savedToken) {
      setToken(savedToken);
      setUser(storedData.user);
      setRole(storedData.user.role);
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
    }
  }, []);

  return (
    <Suspense fallback={<LoaderDialog loading={true} />}>
      <AuthContext.Provider value={{ token, setToken, user, role }}>
        {/* <AdminContext.Provider value={{}}> */}
        <Toaster position="bottom-right" />
        <Outlet />
        {/* </AdminContext.Provider> */}
      </AuthContext.Provider>
    </Suspense>
  );
}

export default memo(App);
