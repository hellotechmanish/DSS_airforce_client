"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CraeteTechnician from "./AddTechnician/AddTechnician";
import CreateUser from "./AddUser/UserAdd";
import TechnicianTab from "../Usermgt/UserTabs/TechnicianTab";
import UserTab from "../Usermgt/UserTabs/UsersTab";

import { API } from "../../../../lib/endpoint";
import { GET } from "../../../../lib/request";
import { useAuth } from "../../../../context/useAuth";

export default function UserManagement() {
  const user = useAuth((state) => state.user);
  const role = user?.role;

  // Uses non-role specific tab names: "tab_one" and "tab_two"
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("user_mgmt_tab");
    if (savedTab) return savedTab;

    return role === "admin" ? "tab_one" : "tab_two";
  });

  const [technician, setTechnician] = useState([]);
  const [users, setUser] = useState([]);

  // Fetch Technicians
  const getTechnicians = useCallback(async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE("technician"));
      setTechnician(res?.msg || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch technicians");
    }
  }, []);

  // Fetch Users
  const getUsers = useCallback(async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE("user"));
      setUser(res?.msg || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  }, []);

  // Save active tab state to localStorage
  useEffect(() => {
    localStorage.setItem("user_mgmt_tab", activeTab);
  }, [activeTab]);

  // Role enforcement fallback safety check
  useEffect(() => {
    if (role !== "admin" && activeTab === "tab_one") {
      setActiveTab("tab_two");
    }
  }, [role, activeTab]);

  // Handle data fetching dynamically based on active tab state
  useEffect(() => {
    if (activeTab === "tab_one" && role === "admin") {
      getTechnicians();
    }
  }, [activeTab, getTechnicians, role]);

  useEffect(() => {
    // Fixed: changed from "usersection" to "tab_two"
    if (activeTab === "tab_two") {
      getUsers();
    }
  }, [activeTab, getUsers]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Breadcrumb Navigation UI */}
      <div className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium no-underline">
          Dashboard
        </Link>

        <span className="mx-2">›</span>

        <span className="text-[#0f3057] font-semibold">User Management</span>
      </div>

      {/* Header Panel */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">USER MANAGEMENT</h2>

        {/* Admin restricted create technician trigger */}
        {role === "admin" && activeTab === "tab_one" && (
          <CraeteTechnician getnumberOftechnician={getTechnicians} />
        )}

        {/* Multi-role context sensitive create user layer */}
        {(role === "admin" || role === "technician") &&
          activeTab === "tab_two" && <CreateUser getnumberOfUser={getUsers} />}
      </div>

      {/* Admin Protected Tab Navigation Switcher */}
      {role === "admin" && (
        <div className="flex gap-6 border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("tab_one")}
            className={`pb-2 font-medium transition ${
              activeTab === "tab_one"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Technician
          </button>

          <button
            onClick={() => setActiveTab("tab_two")}
            className={`pb-2 font-medium transition ${
              activeTab === "tab_two"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Users
          </button>
        </div>
      )}

      {/* Context-Rendered Grid Content Mount Layout Layers */}

      {/* Admin Technician Dataset Frame */}
      {activeTab === "tab_one" && role === "admin" && (
        <TechnicianTab
          technician={technician}
          getnumberOftechnician={getTechnicians}
        />
      )}

      {/* Standard Core Users Dataset Frame */}
      {activeTab === "tab_two" && (
        <UserTab user={users} getnumberOfUser={getUsers} />
      )}
    </div>
  );
}
