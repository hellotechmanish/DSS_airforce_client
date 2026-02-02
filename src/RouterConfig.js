// React import
import { Outlet, useRouteError } from "react-router-dom";
//Main module
import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";
import Unauthorized from "./views/component/Unauthorized";
//Auth component
import SignIn from "./views/signIn/SignPage";
//Admin component Import
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
// Sidebar Icons Import
const RootErrorBoundary = () => {
  let error = useRouteError();
  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = "/")}>
        Click here to reload the app
      </button>
    </div>
  );
};

export const routes = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/signIn", element: <SignIn /> },
      { path: "*", element: <Unauthorized /> },
      {
        path: "",
        element: <Outlet />,
        errorElement: <RootErrorBoundary />,
        children: [],
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/resistence-monitoring",
        element: <Resistence />,
      },
      {
        path: "/dashboard",
        element: <HomePage />,
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
];
