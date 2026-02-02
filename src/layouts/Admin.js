import React, { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./navbar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

export default function Admin() {
  const { token } = React.useContext(AuthContext);

  return (
    <>
      {token && (
        <div>
          <Navbar />
          <Outlet />
        </div>
      )}
    </>
  );
}
