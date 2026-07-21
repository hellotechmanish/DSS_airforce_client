// React import
// import { useRouteError } from "react-router-dom";

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
import Resistencecentralized from "./views/pages/Resistence-centralized/ResistanceData";
import Resistence from "./views/pages/ResisteanceMonitoring/ResistanceTable";
import Temperature from "./views/pages/TemperatureMonitoring/TemperatureTable";
import SitesProfile from "./views/pages/Managment/SitesMgt/SitesProfile/sites-profile";
import TechnicianProfile from "./views/pages/Managment/Usermgt/UserTabs/TechProfile/TechnicianProfile";
import UserProfile from "./views/pages/Managment/Usermgt/UserTabs/UserProfile/UserProfile";
import TestHomepage from "../src/views/component/test-homepage";
// Import ProtectedRoute
import ProtectedRoute from "./lib/ProtectedRoute";

// const RootErrorBoundary = () => {
//   let error = useRouteError();
//   return (
//     <div>
//       <h1>Something went wrong</h1>
//       <pre>{error?.message || JSON.stringify(error)}</pre>
//       <button onClick={() => (window.location.href = "/")}>Reload</button>
//     </div>
//   );
// };

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
            // element: <Navigate to="/dashboard" replace />,
            element: <HomePage />,
          },
          {
            path: "/test",
            // element: <Navigate to="/dashboard" replace />,
            element: <TestHomepage />,
          },
          {
            path: "/dashboard",
            element: <HomePage />,
          },
          {
            path: "/resistance-Centralized-monitoring",
            element: <Resistencecentralized />,
          },
          {
            path: "/resistance-monitoring",
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
          // {
          //   path: "/reboot",
          //   element: <Reboot />,
          // },
          // {
          //   path: "/shutdown",
          //   element: <Shutdown />,
          // },
          {
            path: "*",
            element: <Unauthorized />,
          },
        ],
      },
    ],
  },
];
