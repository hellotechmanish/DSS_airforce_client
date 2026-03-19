"use client";

import React, { useState } from "react";

export default function DeviceProfileDialog({ sensorValue }) {
  const [open, setOpen] = useState(false);

  if (!sensorValue) return null;

  return (
    <>
      {/* Trigger */}
      <span
        onClick={() => setOpen(true)}
        className="text-sky-600 hover:underline cursor-pointer"
      >
        View Profile
      </span>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border 
                    max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-[#0f3057]">
              <h2 className="text-white font-semibold tracking-wide text-sm uppercase">
                Device Profile
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-200 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 space-y-6 bg-gray-100 text-sm">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-5">
                <Info label="Site Name" value={sensorValue?.siteId?.siteName} />
                <Info label="Site UID" value={sensorValue?.siteId?.uid} />
                <Info label="Device Name" value={sensorValue?.deviceName} />
                <Info label="Node UID" value={sensorValue?.nodeUid} />
              </div>

              {/* Sensor Section */}
              <div className="bg-white border rounded-lg p-5 shadow-sm space-y-5">
                {/* Phase */}
                <div className="grid grid-cols-2 gap-5">
                  <Info label="Phase Sensors" value={sensorValue?.vmrSensors} />

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                      Phase Threshold
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {["r", "y", "b", "ry", "yb", "rb"].map((f) => (
                        <div
                          key={f}
                          className="bg-gray-200 border rounded-md px-2 py-2 text-xs text-center font-semibold text-gray-800"
                        >
                          {f.toUpperCase()}
                          <div className="mt-1 text-sm">
                            {sensorValue?.vmrSensorsThreshold?.[f] ?? "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SPD */}
                <div className="grid grid-cols-2 gap-5">
                  <Info label="SPD Sensors" value={sensorValue?.spdSensors} />
                  <Info
                    label="SPD Threshold"
                    value={sensorValue?.spdSensorsThreshold}
                  />
                </div>

                {/* RES */}
                <div className="grid grid-cols-2 gap-5">
                  <Info label="RES Sensors" value={sensorValue?.resSensors} />
                  <Info
                    label="RES Threshold"
                    value={sensorValue?.resSensorsThreshold}
                  />
                </div>

                {/* GN */}
                <div className="grid grid-cols-2 gap-5">
                  <Info label="GN Sensors" value={sensorValue?.nerSensors} />
                  <Info
                    label="GN Threshold"
                    value={sensorValue?.nerSensorsThreshold}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable Info Block */
// function InfoBlock({ label, value }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium mb-1">{label}</label>
//       <div className="border rounded px-3 py-2 bg-gray-100">{value ?? "-"}</div>
//     </div>
//   );
// }

function Info({ label, value }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="border rounded px-3 py-1.5 bg-gray-100 text-sm">
        {value ?? "-"}
      </div>
    </div>
  );
}
