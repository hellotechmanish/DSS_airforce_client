"use client";

import React, { useCallback, useEffect, useState } from "react";
import { POST } from "../../../../../../../../../lib/request";
import { API } from "../../../../../../../../../lib/endpoint";

export default function SensorDialog({ user, sensorValue }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [getSelectSensor, setGetSelectSensor] = useState(null);

  const tabs = ["Resistance", "GN", "Phase", "SPD"];

  // ================= API =================
  const getAssignSensorData = useCallback(async () => {
    try {
      if (!user?._id || !sensorValue?._id) return;

      const res = await POST(API.USERS.GET_ASSIGNED_SENSOR, {
        userId: user?._id,
        deviceId: sensorValue?._id,
      });

      setGetSelectSensor(res.msg?.[0]);
    } catch (err) {
      console.error("Error fetching assigned sensor data", err);
    }
  }, [sensorValue?._id, user?._id]);

  useEffect(() => {
    if (open) getAssignSensorData();
  }, [open, getAssignSensorData]);

  return (
    <>
      {/* Trigger */}
      <span
        className="text-sky-600 hover:underline cursor-pointer"
        onClick={() => setOpen(true)}
      >
        view
      </span>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0a192f] to-[#0f3057]">
              <h2 className="text-white text-sm font-semibold uppercase">
                Assigned Sensors
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              {tabs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTab(i)}
                  className={`px-4 py-2 text-sm font-medium ${
                    tab === i
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="p-6 min-h-[200px]">
              {/* RES */}
              {tab === 0 && (
                <SensorList data={getSelectSensor?.resistanceNumber} />
              )}

              {/* GN */}
              {tab === 1 && <SensorList data={getSelectSensor?.gnNumber} />}

              {/* PHASE */}
              {tab === 2 && <SensorList data={getSelectSensor?.phaseNumber} />}

              {/* SPD */}
              {tab === 3 && <SensorList data={getSelectSensor?.spdNumber} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable Sensor List */
function SensorList({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">No assigned sensor</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50"
        >
          <input type="checkbox" checked readOnly className="accent-blue-600" />
          <span className="text-sm font-medium">{item}</span>
        </div>
      ))}
    </div>
  );
}
