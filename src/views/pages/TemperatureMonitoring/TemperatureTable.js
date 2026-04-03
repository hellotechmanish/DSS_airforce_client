"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";

import NodataFound from "../../../assets/img/nodatafound.png";
import { AuthContext } from "../../../context/AuthContext";

export default function TemperatureTable() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const auth = useContext(AuthContext);
  const role = auth?.user?.role;

  // ================= FETCH =================
  const getAllSiteTemperature = async () => {
    try {
      const res = await GET(
        `${API.SITE.GET_ALL_SITE_TEMP}?page=${page}&limit=${limit}`,
      );

      console.log("API Response:", res);

      const formattedData =
        res?.msg?.map((row) => {
          const site = row?.siteId?.[0] || {};

          return {
            siteUid: site?.uid || "-",
            siteName: site?.siteName || "-",
            deviceUid: row?.nodeUid || "-",
            deviceName: row?.deviceName || "-",
            temperature: row?.tempValue ?? "-",
            humidity: row?.humValue ?? "-",
          };
        }) || [];

      setData(formattedData);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotal(res?.pagination?.total || 0);
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  useEffect(() => {
    getAllSiteTemperature();

    const interval = setInterval(getAllSiteTemperature, 20000);
    return () => clearInterval(interval);
  }, [page, limit]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      `${row.deviceName} ${row.deviceUid}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [data, search]);

  // ================= PAGINATION LOGIC =================
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium no-underline">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[#0f3057] font-semibold">
          Temperature Monitoring
        </span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">
          TEMPERATURE & HUMIDITY MONITORING
        </h2>

        <span className="text-white font-medium">{total} Devices</span>
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#0f3057]">
          Active Device Data
        </h3>

        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
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

              {(role === "admin" || role === "technician") && (
                <th className="px-4 py-3 text-left">Site UID</th>
              )}

              <th className="px-4 py-3 text-left">Site Name</th>
              <th className="px-4 py-3 text-left">Device UID</th>
              <th className="px-4 py-3 text-left">Device Name</th>
              <th className="px-4 py-3 text-left">Temperature (°C)</th>
              <th className="px-4 py-3 text-left">Humidity (%)</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>

                {(role === "admin" || role === "technician") && (
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    #{row.siteUid}
                  </td>
                )}

                <td className="px-4 py-3 text-blue-600 font-medium">
                  {row.siteName}
                </td>

                <td className="px-4 py-3">#{row.deviceUid}</td>

                <td className="px-4 py-3">{row.deviceName}</td>

                <td className="px-4 py-3 text-red-600 font-semibold">
                  {row.temperature}
                </td>

                <td className="px-4 py-3 text-blue-600 font-semibold">
                  {row.humidity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NO DATA */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <img alt="nodatafound" src={NodataFound} className="w-40 opacity-80" />
            <p className="mt-4 text-blue-500 font-medium">No Device Found</p>
          </div>
        )}

        {/* ✅ PAGINATION FOOTER */}
        <div className="flex justify-between items-center p-4 border-t text-sm">
          {/* LEFT */}
          <div>
            Showing {start} - {end} of {total}
          </div>

          {/* CENTER */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              {page}
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
