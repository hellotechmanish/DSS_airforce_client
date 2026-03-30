import React from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  const { token } = React.useContext(AuthContext);

  return (
    <>
      {token && (
        <div>
          <Navbar />

          {/* 👇 ADD THIS */}
          <div className="pt-16 px-4">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
