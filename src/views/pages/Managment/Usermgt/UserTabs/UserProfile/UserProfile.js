import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import PersonalTab from "./PersonalTab/PersonalTab";
import AssignedTab from "./AssignedTab/AssiginedTab";

export default function UserManagment() {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState(0);

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
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 flex gap-6">
          <button
            onClick={() => setActiveTab(0)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === 0
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Personal Information
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === 1
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Assigned
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 0 && <PersonalTab state={state} />}
          {activeTab === 1 && <AssignedTab state={state} />}
        </div>
      </div>
    </div>
  );
}
