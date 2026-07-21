"use client";

import React, { useEffect, useState, useContext } from "react";
import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";
import NodataFound from "../../../assets/img/nodatafound.png";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";
import { FiBell, FiCheckCircle } from "react-icons/fi";

export default function Resistencecentralized() {
  const [resistance, setResistance] = useState([]);
  const auth = useContext(AuthContext);

  // ================= FETCH =================
  const getAllSiteResistance = async () => {
    try {
      const res = await GET(`${API.SITE.ALL_RESISTANCE}?page=1&limit=500`);
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

  // ================= DYNAMIC 5-SENSOR CHUNKING =================
  // Har array / list ko 5-5 ke groups me divide karne ka chunking function
  const chunkSize = 5;
  const sensorGroups = [];

  for (let i = 0; i < resistance.length; i += chunkSize) {
    const chunk = resistance.slice(i, i + chunkSize);
    const startNum = i + 1;
    const endNum = i + chunk.length;

    sensorGroups.push({
      title: `Group ${Math.floor(i / chunkSize) + 1} (${startNum} - ${endNum})`,
      sensors: chunk,
    });
  }

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-5 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold tracking-wide">
          RESISTANCE MONITORING
        </h2>
        <span className="text-white font-medium bg-[#1f4068] px-4 py-1 rounded-full text-sm">
          {resistance.length} Active Sensors
        </span>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="mb-6 flex justify-end items-center">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f3057] hover:bg-[#1f4068] text-white rounded-lg transition shadow-md"
        >
          <HiOutlineDownload size={18} /> Download CSV
        </button>
      </div>

      {/* DYNAMIC SENSOR GROUPS CONTAINER */}
      <div className="space-y-8">
        {sensorGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
          >
            {/* GROUP TITLE */}
            <h3 className="text-lg font-bold text-[#0f3057] mb-4 pb-2 border-b border-slate-200">
              {group.title}
            </h3>

            {/* CARDS GRID (5 CARDS PER ROW) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {group.sensors.map((item, itemIdx) => {
                const globalIndex = groupIdx * chunkSize + itemIdx + 1;
                const value = item?.resistanceValue || 0;
                const threshold = item?.resSensorsThreshold || 0;
                const isAlert = value > threshold;

                return (
                  <div
                    key={item?._id || itemIdx}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
                      isAlert
                        ? "bg-red-50 border-red-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-800 text-base">
                        #{item?.resistanceNumber || globalIndex}
                      </span>
                      {isAlert ? (
                        <div className="flex items-center gap-1 text-red-600 font-semibold text-xs bg-red-100 px-2 py-1 rounded-full">
                          <FiBell className="animate-pulse" /> Alert
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded-full">
                          <FiCheckCircle /> Normal
                        </div>
                      )}
                    </div>

                    {/* CARD BODY DETAILS */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Site Name:</span>
                        <span className="text-slate-800 font-semibold truncate max-w-[100px]">
                          {item?.siteName || "N/A"}
                        </span>
                      </div>

                      {auth?.user?.role !== "user" && (
                        <div className="flex justify-between">
                          <span className="font-medium">Site UID:</span>
                          <span className="text-slate-800">
                            {item?.siteUid || "N/A"}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="font-medium">Device UID:</span>
                        <span className="text-slate-800">
                          {item?.nodeUid || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Device Name:</span>
                        <span className="text-slate-800 truncate max-w-[100px]">
                          {item?.deviceName || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Res. UID:</span>
                        <span className="text-slate-800">
                          {item?.resistanceNumber || globalIndex}
                        </span>
                      </div>
                    </div>

                    {/* CARD FOOTER VALUE */}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">
                        Value:
                      </span>
                      <span
                        className={`text-base font-bold ${
                          isAlert ? "text-red-600" : "text-slate-900"
                        }`}
                      >
                        {value} Ω
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* NO DATA STATE */}
      {resistance.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl mt-6">
          <img alt="no data found" src={NodataFound} className="w-36 mb-3" />
          <p className="text-slate-500 font-medium">No Sensor Data Available</p>
        </div>
      )}
    </div>
  );
}
