import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <>
      <div gap={1}>
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
