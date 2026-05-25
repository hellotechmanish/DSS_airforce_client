import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token =
    localStorage.getItem(
      "token"
    );

  // already logged in

  if (token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // not logged in

  return <Outlet />;
};

export default AuthLayout;