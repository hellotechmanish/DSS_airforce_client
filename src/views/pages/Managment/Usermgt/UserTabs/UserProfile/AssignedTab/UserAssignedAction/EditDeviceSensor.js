"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { POST } from "../../../../../../../../lib/request";
import { API } from "../../../../../../../../lib/endpoint";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

export default function EditSensorDialog({
  getdevicebyuserId,
  UserId,
  device,
  SiteName,
  selectUid,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const [resValue, setResValue] = useState([]);
  const [spdNumber, setSpdNumber] = useState([]);
  const [gnNumber, setGnNumber] = useState([]);
  const [phaseNumber, setPhaseNumber] = useState([]);

  //    FIX: default empty array (NOT null)
  const [getSelectSensor, setGetSelectSensor] = useState([]);

  // ================= VALUES =================
  const rValue = useMemo(
    () =>
      Array.from(
        { length: Number(device?.resSensors || 0) },
        (_, i) => `R${i + 1}`,
      ),
    [device?.resSensors],
  );

  const gnValue = useMemo(
    () =>
      Array.from(
        { length: Number(device?.nerSensors || 0) },
        (_, i) => `GN${i + 1}`,
      ),
    [device?.nerSensors],
  );

  const vmrValue = useMemo(
    () =>
      Array.from(
        { length: Number(device?.vmrSensors || 0) },
        (_, i) => `PH${i + 1}`,
      ),
    [device?.vmrSensors],
  );

  const spValue = useMemo(
    () =>
      Array.from(
        { length: Number(device?.spdSensors || 0) },
        (_, i) => `SPD${i + 1}`,
      ),
    [device?.spdSensors],
  );

  // ================= FETCH =================
  const EditDeviceData = useCallback(async () => {
    try {
      const res = await POST(API.USERS.GET_ASSIGNED_SENSOR, {
        userId: UserId,
        deviceId: device?._id,
      });

      // console.log("API RESPONSE:", res);
      toast.success("Sensor data fetched successfully");
      //    FIX: always array
      setGetSelectSensor(Array.isArray(res?.msg) ? res.msg : []);
    } catch (err) {
      setGetSelectSensor([]);
    }
  }, [UserId, device?._id]);

  useEffect(() => {
    if (open) EditDeviceData();
  }, [open, EditDeviceData]);

  // ================= SET VALUES =================
  useEffect(() => {
    if (Array.isArray(getSelectSensor) && getSelectSensor.length > 0) {
      const sensor = getSelectSensor[0];

      setResValue(sensor?.resistanceNumber || []);
      setSpdNumber(sensor?.spdNumber || []);
      setGnNumber(sensor?.gnNumber || []);
      setPhaseNumber(sensor?.phaseNumber || []);
    } else {
      //    reset if no data
      setResValue([]);
      setSpdNumber([]);
      setGnNumber([]);
      setPhaseNumber([]);
    }
  }, [getSelectSensor]);

  // ================= UPDATE =================
  const EditDevice = async () => {
    try {
      await POST(API.USERS.ASSIGN_DEVICE_SENSOR, {
        userId: UserId,
        deviceId: device?._id,
        phaseNumber,
        resistanceNumber: resValue,
        spdNumber,
        gnNumber,
      });

      setOpen(false);
      getdevicebyuserId();
      toast.success("Device sensors updated successfully");
    } catch (err) {
      toast.error("Failed to update device sensors");
    }
  };

  const tabs = ["Resistance", "GN", "Phase", "SPD"];

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-blue-600">
        <CiEdit size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0a192f] to-[#0f3057]">
              <h2 className="text-white text-sm font-semibold uppercase">
                Edit Sensor
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 bg-gray-50 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Selected Site</p>
                <div className="border rounded p-2 bg-white">
                  <p className="font-medium">{SiteName}</p>
                  <p className="text-gray-500 text-xs">{selectUid}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Selected Device</p>
                <div className="border rounded p-2 bg-white">
                  <p className="font-medium">{device?.deviceName}</p>
                  <p className="text-gray-500 text-xs">{device?.nodeUid}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTab(i)}
                  className={`px-4 py-2 text-sm ${
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
              {tab === 0 && (
                <SensorGrid
                  data={rValue}
                  selected={resValue}
                  set={setResValue}
                />
              )}
              {tab === 1 && (
                <SensorGrid
                  data={gnValue}
                  selected={gnNumber}
                  set={setGnNumber}
                />
              )}
              {tab === 2 && (
                <SensorGrid
                  data={vmrValue}
                  selected={phaseNumber}
                  set={setPhaseNumber}
                />
              )}
              {tab === 3 && (
                <SensorGrid
                  data={spValue}
                  selected={spdNumber}
                  set={setSpdNumber}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={EditDevice}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Grid */
function SensorGrid({ data = [], selected = [], set }) {
  const toggle = (item) => {
    if (selected.includes(item)) {
      set(selected.filter((i) => i !== item));
    } else {
      set([...selected, item]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((item, i) => (
        <label
          key={i}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggle(item)}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
