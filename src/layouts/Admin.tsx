import React from "react";

import { Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/navbar";

const Admin = () => {
  const { token } = React.useContext(AuthContext);

  // no token

  if (!token) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div className="pt-[70px] px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
