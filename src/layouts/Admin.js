import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* 🔑 FIXED GLOBAL ALIGNMENT: Added pt-20 (Padding Top) to handle fixed Navbar spacing across all views */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 pt-20 px-6 pb-6">
          {/* Child sub pages view frame matrix rendering container */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
