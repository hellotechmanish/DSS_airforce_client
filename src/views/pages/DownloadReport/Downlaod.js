"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { HiOutlineDownload } from "react-icons/hi";
import { POST, GET } from "../../../lib/request";
import { API } from "../../../lib/endpoint";
import toast from "react-hot-toast";

export default function DownloadReportDialog({
  sensor,
  vmrSensors,
  device,
  GraphDate,
}) {
  const [open, setOpen] = useState(false);
  const [deviceSensorNumber, setDeviceSensorNumber] = useState([]);
  const [dataNumber, setDataNumber] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );

  useEffect(() => {
    if (open) {
      setStartDate(GraphDate ?? moment(new Date()).format("YYYY-MM-DD"));
    }
  }, [open, GraphDate]);

  // ================= SENSOR LOGIC =================
  useEffect(() => {
    if (!device) return;

    const buildArray = (count, prefix, labelPrefix) => {
      let arr = [];
      let labelArr = [];
      for (let i = 0; i < count; i++) {
        arr.push(`${prefix}_${i}`);
        labelArr.push(`${labelPrefix}${i + 1}`);
      }
      setDeviceSensorNumber(arr);
      setDataNumber(labelArr);
    };

    if (sensor === "RES" && device?.resSensors)
      buildArray(device.resSensors, "RES", "R");

    if (sensor === "SPD" && device?.spdSensors)
      buildArray(device.spdSensors, "SPD", "SPD");

    if (sensor === "NER" && device?.nerSensors)
      buildArray(device.nerSensors, "NER", "GN");

    if (sensor === "VMR" && device?.vmrSensors)
      buildArray(device.vmrSensors, "VMR", "PH");

    if (sensor === "TEMP") buildArray(1, "Temp", "T");

    if (sensor === "HUM") buildArray(1, "Hum", "H");
  }, [sensor, device]);

  // ================= GENERATE REPORT =================
  async function handleDownloadReport() {
    try {
      const body = {
        deviceId: device?._id,
        sensorName: sensor,
        deviceNumber: deviceSensorNumber,
        startDate,
        endDate,
      };

      const resp = await POST(API.DEVICE.GENERATE_REPORT, body);

      if (resp) {
        await downloadCSV();
      }
    } catch (error) {
      toast.error("Failed to generate report");
    }
  }

  // ================= DOWNLOAD CSV =================
  const downloadCSV = async () => {
    try {
      const res = await GET(API.DEVICE.DOWNLOAD_CSV, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res], { type: "application/csv" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download CSV");
    }
  };

  return (
    <>
      {/* Download Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2
             px-5 py-2.5
             text-white text-sm font-semibold
             rounded-lg
             shadow-md hover:shadow-lg
             transition-all duration-200
             hover:bg-blue-800 active:scale-95"
      >
        <HiOutlineDownload size={18} />
        Download
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                        flex items-center justify-center z-50 p-4"
        >
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl 
                          border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center 
                            px-5 py-4 border-b bg-gray-50 rounded-t-xl"
            >
              <h2 className="text-base font-semibold text-gray-800">
                Download Report
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center 
                           rounded-full hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-sm">
              <div className="text-gray-700 font-medium">
                {sensor === "VMR"
                  ? `Phase Meter ${vmrSensors}`
                  : `${sensor} ${dataNumber.join(", ")}`}
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-600">
                  Select Timeline
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  />

                  <span className="text-gray-500 text-sm">to</span>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  handleDownloadReport();
                }}
                className="px-5 py-2 text-sm bg-[#0f3057] text-white 
                           rounded-lg hover:bg-[#163e6b] transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
