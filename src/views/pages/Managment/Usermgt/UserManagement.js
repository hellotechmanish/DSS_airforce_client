"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CraeteTechnician from "./AddTechnician/AddTechnician";
import CreateUser from "./AddUser/UserAdd";
import TechnicianTab from "../Usermgt/UserTabs/TechnicianTab";
import UserTab from "../Usermgt/UserTabs/UsersTab";

import { AuthContext } from "../../../../context/AuthContext";
import { API } from "../../../../lib/endpoint";
import { GET } from "../../../../lib/request";

export default function UserManagement() {
  const auth = useContext(AuthContext);

  const role = auth?.user?.role;

  const [activeTab, setActiveTab] = useState(
    role === "admin" ? "technician" : "user",
  );

  const [technician, setTechnician] = useState([]);
  const [user, setUser] = useState([]);

  // ===============================
  // Fetch Technician
  // ===============================
  const getTechnicians = useCallback(async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE("technician"));

      setTechnician(res?.msg || []);
    } catch (err) {
      console.error(err);

      toast.error("Failed to fetch technicians");
    }
  }, []);

  // ===============================
  // Fetch Users
  // ===============================
  const getUsers = useCallback(async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE("user"));

      setUser(res?.msg || []);
    } catch (err) {
      console.error(err);

      toast.error("Failed to fetch users");
    }
  }, []);

  // ===============================
  // Effects
  // ===============================

  useEffect(() => {
    if (activeTab === "technician" && role === "admin") {
      getTechnicians();
    }
  }, [activeTab, getTechnicians, role]);

  useEffect(() => {
    if (activeTab === "user") {
      getUsers();
    }
  }, [activeTab, getUsers]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Breadcrumb */}

      <div className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium no-underline">
          Dashboard
        </Link>

        <span className="mx-2">›</span>

        <span className="text-[#0f3057] font-semibold">User Management</span>
      </div>

      {/* Header */}

      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">USER MANAGEMENT</h2>

        {/* Admin → Add Technician */}

        {role === "admin" && activeTab === "technician" && (
          <CraeteTechnician getnumberOftechnician={getTechnicians} />
        )}

        {/* Admin + Technician → Add User */}

        {(role === "admin" || role === "technician") &&
          activeTab === "user" && <CreateUser getnumberOfUser={getUsers} />}
      </div>

      {/* Tabs (Only Admin) */}

      {role === "admin" && (
        <div className="flex gap-6 border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("technician")}
            className={`pb-2 font-medium transition ${
              activeTab === "technician"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Technician
          </button>

          <button
            onClick={() => setActiveTab("user")}
            className={`pb-2 font-medium transition ${
              activeTab === "user"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Users
          </button>
        </div>
      )}

      {/* Content */}

      {/* Technician Table */}

      {activeTab === "technician" && role === "admin" && (
        <TechnicianTab
          technician={technician}
          getnumberOftechnician={getTechnicians}
        />
      )}

      {/* User Table */}

      {activeTab === "user" && (
        <UserTab user={user} getnumberOfUser={getUsers} />
      )}
    </div>
  );
}
