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
import Resistence from "./views/pages/ResisteanceMonitoring/ResistanceTable";
import Temperature from "./views/pages/TemperatureMonitoring/TemperatureTable";
import SitesProfile from "./views/pages/Managment/SitesMgt/SitesProfile/sites-profile";
import TechnicianProfile from "./views/pages/Managment/Usermgt/UserTabs/TechProfile/TechnicianProfile";
import UserProfile from "./views/pages/Managment/Usermgt/UserTabs/UserProfile/UserProfile";
// import TestHomepage from "../src/views/component/test-homepage";
import { Navigate } from "react-router-dom"; //      Navigate import karna mat bhoolna
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
  // 🔓 1. PUBLIC ROUTES (Sirf Login aur Forgot Password ke liye)
  {
    element: <AuthLayout />,
    children: [
      { path: "/signIn", element: <SignIn /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },

  //     2. PROTECTED ROUTES (Saare Dashboards aur Monitoring Pages)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          //   FIXED: Jab koi sirf "/" khole, use safely dashboard par navigate karwao
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <HomePage />,
          },
          // {
          //   path: "/test",
          //   element: <TestHomepage />,
          // },
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
        ],
      },
    ],
  },

  // ⚠️ 3. GLOBAL WILDCARD FALLBACK (Puri list ke bahar hona chahiye)
  // Agar upar diye gaye kisi bhi raste se URL match nahi khata, tabhi yeh chalega
  {
    path: "*",
    element: <Unauthorized />,
  },
];
