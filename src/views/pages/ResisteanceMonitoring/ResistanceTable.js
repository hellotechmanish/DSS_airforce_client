"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";
import NodataFound from "../../../assets/img/nodatafound.png";

export default function Resistance() {
  const [resistance, setResistance] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const getAllSiteResistance = async () => {
    try {
      const res = await GET(API.SITE.ALL_RESISTANCE);
      setResistance(res?.msg || []);
    } catch (err) {
      console.error(err);
      setResistance([]);
    }
  };

  useEffect(() => {
    getAllSiteResistance();

    const interval = setInterval(getAllSiteResistance, 20000);
    return () => clearInterval(interval);
  }, []);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return resistance.filter((row) =>
      `${row?.deviceName} ${row?.nodeUid}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [resistance, search]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium no-underline">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[#0f3057] font-semibold">
          Resistance Monitoring
        </span>
      </nav>

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">
          RESISTANCE MONITORING
        </h2>
        <span className="text-white font-medium">
          {filteredData.length} Sensors
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#0f3057]">
          Active Resistance Devices
        </h3>

        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Site UID</th>
              <th className="px-4 py-3 text-left">Site Name</th>
              <th className="px-4 py-3 text-left">Device UID</th>
              <th className="px-4 py-3 text-left">Device Name</th>
              <th className="px-4 py-3 text-left">Resistance UID</th>
              <th className="px-4 py-3 text-left">Resistance Value</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => {
              const value = row?.resistanceValue || 0;
              const threshold = row?.resSensorsThreshold || 0;

              return (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {row?.siteId?.[0]?.uid || "-"}
                  </td>

                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {row?.siteId?.[0]?.siteName || "-"}
                  </td>

                  <td className="px-4 py-3">{row?.nodeUid}</td>

                  <td className="px-4 py-3">{row?.deviceName}</td>

                  <td className="px-4 py-3">{row?.resistanceNumber}</td>

                  {/* 🔥 Highlight Logic */}
                  <td
                    className={`px-4 py-3 ${
                      value > threshold
                        ? "bg-red-200 text-red-700 font-semibold rounded"
                        : ""
                    }`}
                  >
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* NO DATA */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <img src={NodataFound} className="w-40 opacity-80" />
            <p className="mt-4 text-blue-500 font-medium">No Device Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
