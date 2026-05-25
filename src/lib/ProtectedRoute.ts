import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface UserDataType {
  user?: {
    role?: string;
  };
}

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  allowedRoles,
}: ProtectedRouteProps) => {
  const storedData: UserDataType =
    JSON.parse(
      localStorage.getItem(
        "userData"
      ) || "{}"
    );

  const token =
    localStorage.getItem("token");

  const userRole =
    storedData?.user?.role;

  // Not logged in

  if (!storedData?.user || !token) {
    return React.createElement(Navigate, { to: "/signIn", replace: true });
  }

  // Role not allowed

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    return React.createElement(Navigate, { to: "/unauthorized", replace: true });
  }

  // Allowed

  return React.createElement(Outlet, null);
};

export default ProtectedRoute;