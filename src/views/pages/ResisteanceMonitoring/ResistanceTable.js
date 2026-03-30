"use client";

import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";

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
  const auth = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
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

  const downloadCSV = () => {
    try {
      const data = resistance; // table wala data

      if (!data.length) {
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

      const rows = data.map((item) =>
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
    } catch (err) {
      toast.error("Download failed");
    }
  };

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
      <div className="mb-4 flex items-center justify-between">
        {/* LEFT */}
        <h3 className="text-xl font-semibold text-[#0f3057]">
          Active Resistance Devices
        </h3>

        {/* RIGHT SIDE WRAPPER */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Download Button (Extreme Right) */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f3057] text-white text-sm font-medium rounded-lg shadow hover:bg-[#163e6b] transition"
          >
            <HiOutlineDownload size={16} />
            Download
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>

              <th className="px-4 py-3 text-left">Site Name</th>
              {auth?.user?.role !== "user" && (
                <th className="px-4 py-3 text-left">Site UID</th>
              )}
              <th className="px-4 py-3 text-left">Device UID</th>
              <th className="px-4 py-3 text-left">Device Name</th>
              <th className="px-4 py-3 text-left">Resistance UID</th>
              <th className="px-4 py-3 text-left">Resistance Value</th>
              <th className="px-4 py-3 text-left">Alert</th>
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
                    {row?.siteName || "-"}
                  </td>

                  {auth?.user?.role !== "user" && (
                    <td className="px-4 py-3 ">{row?.siteUid || "-"}</td>
                  )}

                  <td className="px-4 py-3">{row?.nodeUid} </td>

                  <td className="px-4 py-3">{row?.deviceName}</td>

                  <td className="px-4 py-3">
                    {row?.resistanceNumber || "offline"}{" "}
                  </td>

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
                  <td className="px-4 py-3 text-center">
                    <div className="relative group flex justify-center items-center">
                      {value > threshold ? (
                        //  ALERT
                        <button onClick={() => setOpenModal(true)}>
                          <FiBell className="text-red-500 text-lg animate-pulse cursor-pointer" />
                        </button>
                      ) : (
                        //  SAFE
                        <FiCheckCircle className="text-green-500 text-lg cursor-pointer" />
                      )}

                      {/*  TOOLTIP LEFT SIDE */}
                      <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-red-500 text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap z-10 flex items-center gap-1 border">
                        {/* icon inside tooltip */}
                        {value > threshold ? (
                          <FiBell className="text-red-500 text-xs" />
                        ) : (
                          <FiCheckCircle className="text-green-500 text-xs" />
                        )}

                        {/* text */}
                        <span>
                          {value > threshold
                            ? "Value exceeded threshold"
                            : "All values normal"}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* NO DATA */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <img
              alt="nodafound"
              src={NodataFound}
              className="w-40 opacity-80"
            />
            <p className="mt-4 text-blue-500 font-medium">No Device Found</p>
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Modal Card */}
          <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <FiBell className="text-red-500 text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Alert Warning
              </h2>
            </div>

            {/* Message */}
            <p className="text-gray-600 text-sm leading-relaxed">
              Resistance value is higher than the defined threshold. Please
              inspect the system and improve grounding to ensure safety.
            </p>

            {/* Divider */}
            <div className="border-t my-4"></div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {/* <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1.5 text-sm rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button> */}

              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
