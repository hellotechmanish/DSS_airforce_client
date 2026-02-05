// import { Outlet } from "react-router-dom";
// const AuthLayout = () => {
//   return (
//     <>
//       <div gap={1}>
//         <Outlet />
//       </div>
//     </>
//   );
// };

// export default AuthLayout;

import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
