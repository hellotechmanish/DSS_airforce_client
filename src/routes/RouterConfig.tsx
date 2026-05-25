import AuthLayout from "../layouts/unAuth";

import AdminLayout from "../layouts/Admin";

import ProtectedRoute from "../lib/ProtectedRoute";

import Unauthorized from "../pages/Unauthorized";

import HomePage from "../pages/Dashboard/HomePage";

import SignIn from "../components/unauthorize_comp/signin";

export const routes = [
  // ================= PUBLIC =================

  {
    element: <AuthLayout />,

    children: [
      {
        path: "/signIn",

        element: <SignIn />,
      },
    ],
  },

  // ================= PROTECTED =================

  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <AdminLayout />,

        children: [
          {
            path: "/",

            element: <HomePage />,
          },

          {
            path: "/dashboard",
            element: <HomePage />,
          },
        ],
      },
    ],
  },

  // ================= FALLBACK =================

  {
    path: "*",

    element: <Unauthorized />,
  },
];
