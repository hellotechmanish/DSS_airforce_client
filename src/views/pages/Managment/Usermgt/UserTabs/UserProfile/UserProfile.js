import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import PersonalTab from "./PersonalTab/PersonalTab";
import AssignedTab from "./AssignedTab/AssiginedTab";

export default function UserManagment() {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 shadow">
        <div className="flex justify-between items-center">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/80">
            <Link to="/dashboard" className="hover:text-white">
              Dashboard
            </Link>

            <span className="mx-2">›</span>

            <Link to="/user-management" className="hover:text-white">
              User Management
            </Link>

            <span className="mx-2">›</span>

            <span className="font-semibold text-white">
              {state?.fullName} ( {state?.uid} )
            </span>
          </nav>

          {/* Title */}
          <h2 className="text-white text-lg font-semibold">User Details</h2>
        </div>
      </div>

      {/* 🔥 MAIN CARD */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        {/* 🔥 TABS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 0
                ? "bg-gray-700 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            User Information
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 1
                ? "bg-gray-700 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Assigned
          </button>
        </div>

        {/* 🔥 CONTENT */}
        <div className="bg-slate-50 rounded-lg p-4 border">
          {activeTab === 0 && <PersonalTab state={state} />}
          {activeTab === 1 && <AssignedTab state={state} />}
        </div>
      </div>
    </div>
  );
}
