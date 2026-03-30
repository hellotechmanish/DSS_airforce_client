"use client";

import React, { useEffect, useState } from "react";

export default function DeviceProfileDialog({
  sensorValue,
  SiteName,
  selectUid,
}) {
  const [open, setOpen] = useState(false);

  const [deviceName, setDeviceName] = useState("");
  const [nodeUid, setNodeUid] = useState("");
  const [vmrSensors, setVmrSensors] = useState("");
  const [resSensors, setResSensors] = useState("");
  const [spdSensors, setSpdSensors] = useState("");
  const [nerSensors, setNerSensors] = useState("");
  const [resSensorsThreshold, setResSensorsThreshold] = useState("");
  const [spdSensorsThreshold, setSpdSensorsThreshold] = useState("");
  const [nerSensorsThreshold, setNerSensorsThreshold] = useState("");

  useEffect(() => {
    if (sensorValue) {
      setDeviceName(sensorValue?.deviceName);
      setNodeUid(sensorValue?.nodeUid);
      setVmrSensors(sensorValue?.vmrSensors);
      setResSensors(sensorValue?.resSensors);
      setResSensorsThreshold(sensorValue?.resSensorsThreshold);
      setSpdSensors(sensorValue?.spdSensors);
      setSpdSensorsThreshold(sensorValue?.spdSensorsThreshold);
      setNerSensors(sensorValue?.nerSensors);
      setNerSensorsThreshold(sensorValue?.nerSensorsThreshold);
    }
  }, [sensorValue]);

  return (
    <>
      {/* Trigger */}
      <span
        className="text-sky-600 hover:underline cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {sensorValue?.deviceName}
      </span>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0a192f] to-[#0f3057]">
              <h2 className="text-white font-semibold text-sm uppercase">
                Device Profile
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-gray-50 text-sm">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Site Name" value={SiteName} />
                <Info label="Site UID" value={selectUid} />
                <Info label="Device Name" value={deviceName} />
                <Info label="Node UID" value={nodeUid} />
              </div>

              {/* Phase Section */}
              <div className="bg-white border rounded-lg p-5 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Phase Sensors" value={vmrSensors} />

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                      Phase Threshold
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {["r", "y", "b", "ry", "yb", "rb"].map((f) => (
                        <div
                          key={f}
                          className="bg-gray-100 border rounded-lg px-2 py-2 text-center"
                        >
                          <div className="text-xs text-gray-500">
                            {f.toUpperCase()}
                          </div>
                          <div className="text-sm font-semibold">
                            {sensorValue?.vmrSensorsThreshold?.[f] ?? "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SPD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="SPD Sensors" value={spdSensors} />
                  <Info label="SPD Threshold" value={spdSensorsThreshold} />
                </div>

                {/* RES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="RES Sensors" value={resSensors} />
                  <Info label="RES Threshold" value={resSensorsThreshold} />
                </div>

                {/* GN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="GN Sensors" value={nerSensors} />
                  <Info label="GN Threshold" value={nerSensorsThreshold} />
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
function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="bg-gray-100 border rounded-md px-3 py-2 text-sm">
        {value ?? "-"}
      </div>
    </div>
  );
}
