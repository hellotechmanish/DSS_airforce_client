// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/signIn" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
//   const token = localStorage.getItem("token");

//   const userRole = storedData?.user?.role;

//   // Not logged in
//   if (!storedData?.user || !token) {
//     return <Navigate to="/signIn" replace />;
//   }

//   //  Role not allowed
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   //  Allowed
//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = localStorage.getItem("token");

  const userRole = storedData?.user?.role;

  if (!storedData?.user || !token) {
    return <Navigate to="/signIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
