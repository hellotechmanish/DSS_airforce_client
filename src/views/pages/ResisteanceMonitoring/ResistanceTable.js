"use client";

import React, { useEffect, useState, useContext, useCallback } from "react";

import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";
import NodataFound from "../../../assets/img/nodatafound.png";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";
import { FiBell, FiCheckCircle } from "react-icons/fi";

export default function Resistance() {
  const [resistance, setResistance] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const auth = useContext(AuthContext);
  // const [openModal, setOpenModal] = useState(false);

  // ================= FETCH =================
  const getAllSiteResistance = useCallback(async () => {
    try {
      const res = await GET(
        `${API.SITE.ALL_RESISTANCE}?page=${page}&limit=${limit}&search=${search}`,
      );

      setResistance(res?.msg || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotal(res?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      setResistance([]);
    }
  }, [page, limit, search]);

  useEffect(() => {
    getAllSiteResistance();

    const interval = setInterval(getAllSiteResistance, 20000);
    return () => clearInterval(interval);
  }, [getAllSiteResistance]);

  // ================= DOWNLOAD =================
  const downloadCSV = () => {
    if (!resistance.length) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "siteUid",
      "siteName",
      "nodeUid",
      "deviceName",
      "resistanceNumber",
      "resistanceValue",
    ];

    const rows = resistance.map((item) =>
      [
        item.siteUid,
        item.siteName,
        item.nodeUid,
        item.deviceName,
        item.resistanceNumber,
        item.resistanceValue,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resistance_report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Downloaded");
  };

  // ================= PAGINATION =================
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => i + Math.max(page - 2, 1),
  ).filter((p) => p <= totalPages);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">
          RESISTANCE MONITORING
        </h2>
        <span className="text-white font-medium">{total} Sensors</span>
      </div>

      {/* SEARCH + DOWNLOAD */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded-lg text-sm w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f3057] text-white rounded"
        >
          <HiOutlineDownload /> Download
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Site Name</th>
              {auth?.user?.role !== "user" && (
                <th className="px-4 py-3">Site UID</th>
              )}
              <th className="px-4 py-3">Device UID</th>
              <th className="px-4 py-3">Device Name</th>
              <th className="px-4 py-3">Resistance UID</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Alert</th>
            </tr>
          </thead>

          <tbody>
            {resistance.map((row, index) => {
              const value = row?.resistanceValue || 0;
              const threshold = row?.resSensorsThreshold || 0;

              return (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 text-center">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="px-4 py-3 text-center">{row?.siteName}</td>

                  {auth?.user?.role !== "user" && (
                    <td className="px-4 py-3 text-center">{row?.siteUid}</td>
                  )}

                  <td className="px-4 py-3 text-center">{row?.nodeUid}</td>
                  <td className="px-4 py-3 text-center">{row?.deviceName}</td>
                  <td className="px-4 py-3 text-center">
                    {row?.resistanceNumber}
                  </td>

                  <td
                    className={`px-4 py-3 text-center ${
                      value > threshold
                        ? "bg-red-200 text-red-700 text-center"
                        : ""
                    }`}
                  >
                    {value}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {value > threshold ? (
                      <FiBell
                        className="text-red-500 animate-pulse text-center"
                        title="Alert: Resistance is higher than the safe limit."
                      />
                    ) : (
                      <FiCheckCircle
                        className="text-green-500 text-center"
                        title="Resistance is within the safe range."
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* NO DATA */}
        {resistance.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <img alt="no data found" src={NodataFound} className="w-40" />
            <p>No Device Found</p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t">
          <div>
            Showing {start} - {end} of {total}
          </div>

          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            {visiblePages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  page === p ? "bg-blue-600 text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>

          <div>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
