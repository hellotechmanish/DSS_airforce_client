// React import
import { Outlet, useRouteError, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";

// Components
import Unauthorized from "./views/component/Unauthorized";
import SignIn from "./views/signIn/SignPage";
import ForgotPassword from "./views/forgetpass/ForgotPassword";

// Admin Pages
import HomePage from "./views/pages/HomePage";
import Alarm from "./views/pages/Alarm/Alarm";
import Setting from "./views/pages/Setting/Setting";
import UserMgt from "./views/pages/Managment/Usermgt/UserManagement";
import SitesMgt from "./views/pages/Managment/SitesMgt/SitesManagment";
import Resistence from "./views/pages/ResisteanceMonitoring/ResistanceTable";
import Temperature from "./views/pages/TemperatureMonitoring/TemperatureTable";
import SitesProfile from "./views/pages/Managment/SitesMgt/SitesProfile/sites-profile";
import TechnicianProfile from "./views/pages/Managment/Usermgt/UserTabs/TechProfile/TechnicianProfile";
import UserProfile from "./views/pages/Managment/Usermgt/UserTabs/UserProfile/UserProfile";

// 🔥 Import ProtectedRoute
import ProtectedRoute from "./lib/ProtectedRoute";
import { elements } from "chart.js";
// import AdminLayout from "./layouts/Admin";
// import AuthLayout from "./layouts/Auth";

const RootErrorBoundary = () => {
  let error = useRouteError();
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error?.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = "/")}>Reload</button>
    </div>
  );
};

export const routes = [
  // 🔓 PUBLIC ROUTES
  {
    element: <AuthLayout />,
    children: [
      { path: "/signIn", element: <SignIn /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "*", element: <Unauthorized /> },
    ],
  },

  // 🔐 PROTECTED ROUTES
  {
    element: <ProtectedRoute />, // 🔐 First protect
    children: [
      {
        element: <AdminLayout />, // 🔥 Layout yaha lagao
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <HomePage />,
          },
          {
            path: "/resistence-monitoring",
            element: <Resistence />,
          },
          {
            path: "/sites-mgt",
            element: <SitesMgt />,
          },
          {
            path: "/user-management",
            element: <UserMgt />,
          },
          {
            path: "/temperature-monitoring",
            element: <Temperature />,
          },
          {
            path: "/alarm",
            element: <Alarm />,
          },
          {
            path: "/setting",
            element: <Setting />,
          },
          {
            path: "/sites-profile",
            element: <SitesProfile />,
          },
          {
            path: "/technician-profile",
            element: <TechnicianProfile />,
          },
          {
            path: "/user-profile",
            element: <UserProfile />,
          },
        ],
      },
    ],
  },
];
