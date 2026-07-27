"use client";

import React, { useEffect, useState, useContext } from "react";
import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";
import NodataFound from "../../../assets/img/nodatafound.png";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";

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
      "Site UID",
      "Site Name",
      "Device UID",
      "Device Name",
      "Resistance Number",
      "Resistance Value (Ω)",
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
    link.setAttribute("download", "Resistance_Monitoring_Report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Downloaded CSV Report");
  };

  // ================= DYNAMIC 5-SENSOR CHUNKING =================
  const chunkSize = 5;
  const sensorGroups = [];

  for (let i = 0; i < resistance.length; i += chunkSize) {
    const chunk = resistance.slice(i, i + chunkSize);
    const startNum = i + 1;
    const endNum = i + chunk.length;

    sensorGroups.push({
      title: `Group ${Math.floor(i / chunkSize) + 1} • Sensors (${startNum} - ${endNum})`,
      sensors: chunk,
    });
  }

  return (
    <div className="p-3 bg-slate-100 min-h-screen text-slate-800 text-[11px] font-sans">
      {/* COMPACT TOP HEADER */}
      <div className="bg-[#0a192f] rounded-lg px-4 py-2 mb-3 flex justify-between items-center shadow-md">
        <h2 className="text-white text-xs font-bold tracking-wider uppercase">
          Centralized Resistance Monitoring
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono font-bold bg-[#1f4068] px-2.5 py-0.5 rounded text-[10px] tracking-wide border border-[#2d5d8f]">
            {resistance.length} Active Sensors
          </span>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition shadow-xs"
          >
            <HiOutlineDownload size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* DYNAMIC HIGHLIGHTED SENSOR GROUPS */}
      <div className="space-y-3">
        {sensorGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="bg-white rounded-lg shadow-sm border-2 border-slate-300 overflow-hidden"
          >
            {/* HIGHLIGHTED GROUP HEADER BAR */}
            <div className="bg-gradient-to-r from-[#0f3057] to-[#1f4068] text-white px-3 py-1.5 flex justify-between items-center border-b border-slate-300">
              <div className="text-[11px] font-bold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full inline-block animate-pulse"></span>
                {group.title}
              </div>
              <span className="text-[9px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30 font-mono">
                {group.sensors.length} Nodes
              </span>
            </div>

            {/* CARDS GRID CONTAINER */}
            <div className="p-2 bg-slate-50/70">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {group.sensors.map((item, itemIdx) => {
                  const globalIndex = groupIdx * chunkSize + itemIdx + 1;
                  const value = item?.resistanceValue || 0;
                  const threshold = item?.resSensorsThreshold || 0;
                  const isAlert = value > threshold && threshold > 0;

                  return (
                    <div
                      key={item?._id || itemIdx}
                      className={`rounded-md border p-2 flex flex-col justify-between transition shadow-2xs ${
                        isAlert
                          ? "bg-red-50/90 border-red-400 ring-1 ring-red-400/50"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div className="flex justify-between items-center pb-1 mb-1 border-b border-slate-100">
                        <span className="font-bold text-slate-900 text-[11px] font-mono">
                          Sensor #{item?.resistanceNumber || globalIndex}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isAlert
                                ? "bg-red-500 animate-ping"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              isAlert ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {isAlert ? "Alert" : "OK"}
                          </span>
                        </div>
                      </div>

                      {/* CLEAR FULL METRIC LABELS */}
                      <div className="space-y-1 text-[10px] text-slate-600 my-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            Site Name:
                          </span>
                          <span
                            className="text-slate-900 font-bold truncate max-w-[85px] text-right"
                            title={item?.siteName}
                          >
                            {item?.siteName || "N/A"}
                          </span>
                        </div>

                        {/* <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            Device Name:
                          </span>
                          <span
                            className="text-slate-800 font-medium truncate max-w-[85px] text-right"
                            title={item?.deviceName}
                          >
                            {item?.deviceName || "N/A"}
                          </span>
                        </div> */}

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            Device UID:
                          </span>
                          <span className="text-slate-800 font-mono text-[9.5px]">
                            {item?.nodeUid || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* HIGH-VISIBILITY VALUE ROW */}
                      <div
                        className={`pt-1 border-t flex justify-between items-center ${
                          isAlert ? "border-red-200" : "border-slate-200"
                        }`}
                      >
                        <span className="text-[9.5px] text-slate-500 font-semibold uppercase">
                          Res. Value:
                        </span>
                        <span
                          className={`font-bold font-mono text-[11px] ${
                            isAlert
                              ? "text-red-600 font-extrabold"
                              : "text-slate-900"
                          }`}
                        >
                          {Number(value).toFixed(2)} Ω
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {resistance.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-slate-200 mt-3 shadow-xs">
          <img alt="no data found" src={NodataFound} className="w-20 mb-2" />
          <p className="text-slate-500 font-medium text-[11px]">
            No Live Sensor Data Available
          </p>
        </div>
      )}
    </div>
  );
}
