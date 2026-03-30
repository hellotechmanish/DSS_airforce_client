import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function UserManagment() {
  const { state } = useLocation();

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <Link to="/dashboard" className="text-sky-500 font-medium">
          Dashboard
        </Link>

        <span className="mx-2">›</span>

        <Link to="/user-management" className="text-sky-500 font-medium">
          User Management
        </Link>

        <span className="mx-2">›</span>

        <span className="text-gray-700 font-semibold">{state?.fullName}</span>
      </nav>

      {/* Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-[#0f3057] mb-6">
          Personal Information
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="text-gray-800 font-medium">{state?.fullName}</p>
          </div>

          {/* UID */}
          <div>
            <p className="text-sm text-gray-500 mb-1">UID</p>
            <p className="text-gray-800 font-medium">{state?.uid}</p>
          </div>

          {/* Password */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Password</p>
            <p className="text-gray-800 font-medium">********</p>
          </div>
        </div>
      </div>
    </div>
  );
}
