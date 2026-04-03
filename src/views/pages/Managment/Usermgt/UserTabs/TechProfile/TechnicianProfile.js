"use client";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function UserManagment() {
  const { state } = useLocation();

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* 🔹 BREADCRUMB */}
      <div className="mb-5 text-sm flex items-center flex-wrap gap-1">
        <Link to="/dashboard" className="text-sky-600 hover:underline">
          Dashboard
        </Link>

        <span className="text-gray-400">›</span>

        <Link to="/user-management" className="text-sky-600 hover:underline">
          User Management
        </Link>

        <span className="text-gray-400">›</span>

        <span className="text-gray-700 font-semibold">
          {state?.fullName || "User"}
        </span>
      </div>

      {/* 🔹 MAIN CARD */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0f3057]">
            Personal Information
          </h2>

          {/* OPTIONAL BADGE */}
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            Technician Details
          </span>
        </div>

        {/* 🔹 INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FULL NAME */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500 mb-1">Full Name</p>
            <p className="text-gray-800 font-semibold text-sm">
              {state?.fullName || "-"}
            </p>
          </div>

          {/* UID */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500 mb-1">UID</p>
            <p className="text-gray-800 font-semibold text-sm">
              {state?.uid || "-"}
            </p>
          </div>

          {/* PASSWORD */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500 mb-1">Password</p>
            <p className="text-gray-800 font-semibold text-sm tracking-widest">
              ********
            </p>
          </div>
        </div>

        {/* 🔹 EXTRA SECTION (OPTIONAL FUTURE USE) */}
        <div className="mt-8 border-t pt-4">
          <p className="text-xs text-gray-400">
            You can extend this section with roles, assigned sites, or device
            data.
          </p>
        </div>
      </div>
    </div>
  );
}
