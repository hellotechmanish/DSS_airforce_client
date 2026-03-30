import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { API } from "../../../../../lib/endpoint";
import { GET, POST } from "../../../../../lib/request";
import AddDevice from "../../../HomePageTab/AddDevice/AddDevice";

export default function Sites() {
  const { state } = useLocation();

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 12;

  const { register, handleSubmit, reset } = useForm();

  // 🔹 Fetch devices
  const getdeviceListbysite = useCallback(async () => {
    try {
      if (!state?._id) return;

      const res = await GET(API.DEVICE.LIST_BY_SITEID(state._id));
      setDevices(Array.isArray(res?.msg) ? res.msg : []);
      setCurrentPage(1); // Reset page on new site load
    } catch (err) {
      console.error(err);
      setDevices([]);
    }
  }, [state?._id]);

  useEffect(() => {
    getdeviceListbysite();
  }, [getdeviceListbysite]);

  // 🔹 Pagination Logic
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(devices.length / devicesPerPage);

  console.log("selectedDevice", selectedDevice);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 🔹 Click device
  const handleDeviceClick = async (device) => {
    try {
      setActiveDeviceId(device._id);
      setLoading(true);
      setSelectedDevice(null);

      const res = await GET(API.DEVICE.GET_BY_ID(device._id));
      const data = res?.msg;

      setSelectedDevice(data);

      // ✅ Prefill form
      // ✅ Prefill form
      reset({
        deviceName: data.deviceName,
        nodeUid: data.nodeUid,
        temp: data.temp,
        humidity: data.humidity,
        resSensors: data.resSensors,
        nerSensors: data.nerSensors,
        vmrSensors: data.vmrSensors,
        spdSensors: data.spdSensors,

        // Thresholds
        resSensorsThreshold: data.resSensorsThreshold,
        nerSensorsThreshold: data.nerSensorsThreshold,
        spdSensorsThreshold: data.spdSensorsThreshold,

        // 🟢 Nested Phase Thresholds (vmrSensorsThreshold)
        vmrSensorsThreshold: {
          r: data.vmrSensorsThreshold?.r || 0,
          y: data.vmrSensorsThreshold?.y || 0,
          b: data.vmrSensorsThreshold?.b || 0,
          ry: data.vmrSensorsThreshold?.ry || 0,
          yb: data.vmrSensorsThreshold?.yb || 0,
          rb: data.vmrSensorsThreshold?.rb || 0,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Submit update
  const onSubmit = async (formData) => {
    console.log("formate", formData);

    try {
      await POST(API.DEVICE.EDIT, {
        deviceId: selectedDevice._id,
        ...formData,
      });

      alert("Device Updated ✅");
      getdeviceListbysite();
    } catch (err) {
      console.error(err);
    }
  };

  if (!state) return <div className="p-6">No Site</div>;

  return (
    <div className="w-full px-4 md:px-6 py-4 space-y-6 bg-[#f3f4f6] min-h-screen">
      {/* 🔵 HEADER */}
      <div className="w-full bg-gradient-to-r from-[#0a192f] to-[#0f3057] text-white px-5 py-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border border-[#1f4068]">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-wide">
            {state.siteName}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 mt-1">
            {state.location}
          </p>
        </div>

        <div className="text-left md:text-right text-xs md:text-sm text-gray-200">
          <p>
            {state.pincode}, {state.country}
          </p>
          <p className="mt-1 font-medium text-white">
            {new Date(state.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 🔵 DEVICE SECTION */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg md:text-xl font-bold text-[#0f3057]">
            Devices ({devices.length})
          </h2>

          <AddDevice
            getdeviceListbysite={getdeviceListbysite}
            state={state}
            sitezero={state}
            value={1}
          />
        </div>

        {/* 🔥 TABS (Wrapped with Pagination) */}
        <div className="flex flex-wrap gap-2 md:gap-3 pb-2">
          {currentDevices.map((d) => (
            <button
              key={d._id}
              onClick={() => handleDeviceClick(d)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
                activeDeviceId === d._id
                  ? "bg-[#0f3057] text-white ring-2 ring-[#0f3057] ring-offset-1 md:ring-offset-2"
                  : "bg-gray-50 text-[#0f3057] border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {d.deviceName}
            </button>
          ))}
        </div>

        {/* 🔥 PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-4 mt-2 gap-3">
            <span className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#0f3057]">
                {indexOfFirstDevice + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0f3057]">
                {Math.min(indexOfLastDevice, devices.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0f3057]">
                {devices.length}
              </span>{" "}
              devices
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#0f3057] border-gray-300 hover:bg-gray-50"
                }`}
              >
                Prev
              </button>

              <div className="px-3 py-1.5 text-xs font-semibold text-[#0f3057] bg-gray-50 border border-gray-200 rounded-md">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#0f3057] border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔵 DEVICE DETAILS PANEL (Compact & Responsive) */}
      {selectedDevice && (
        <div className="flex justify-center pb-10">
          <div className="w-full md:w-[85%] lg:w-[65%] xl:w-[55%] bg-white rounded-xl shadow-lg border border-[#1f4068] p-4 md:p-6 transition-all duration-300">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg md:text-xl font-bold text-[#0f3057]">
                Device Details
              </h2>

              <button
                onClick={() => {
                  setSelectedDevice(null);
                  setActiveDeviceId(null);
                }}
                className="text-gray-400 hover:text-[#0f3057] bg-gray-100 hover:bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center transition-colors text-xs"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* LOADER */}
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-b-4 border-[#0f3057] rounded-full"></div>
              </div>
            )}

            {/* 🔥 FORM */}
            {!loading && selectedDevice && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* 🔵 TITLE */}
                <h3 className="text-sm font-bold text-[#1f4068] bg-[#f8fafc] p-2.5 rounded-lg border border-gray-200">
                  {selectedDevice.deviceName}
                </h3>

                {/* 🔷 BASIC INFO */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Device Name
                      </label>
                      <input
                        {...register("deviceName")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Node UID
                      </label>
                      <input
                        {...register("nodeUid")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Temperature
                      </label>
                      <input
                        {...register("temp")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Humidity
                      </label>
                      <input
                        {...register("humidity")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 🔷 SENSOR CONFIG */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Sensor Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        RES Sensors
                      </label>
                      <input
                        {...register("resSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        GN Sensors
                      </label>
                      <input
                        {...register("nerSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        VMR Sensors
                      </label>
                      <input
                        {...register("vmrSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        SPD Sensors
                      </label>
                      <input
                        {...register("spdSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 🔷 THRESHOLDS */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Threshold Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        RES Threshold
                      </label>
                      <input
                        {...register("resSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        GN Threshold
                      </label>
                      <input
                        {...register("nerSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        SPD Threshold
                      </label>
                      <input
                        {...register("spdSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phase Threshold */}
                  <div className="pt-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Phase Threshold
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        {...register("vmrSensorsThreshold.r")}
                        placeholder="R"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.y")}
                        placeholder="Y"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.b")}
                        placeholder="B"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.ry")}
                        placeholder="RY"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.yb")}
                        placeholder="YB"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.rb")}
                        placeholder="RB"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 🔷 SUBMIT */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0f3057] text-white text-sm font-medium rounded-lg hover:bg-[#1f4068] transition-all shadow-md active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
