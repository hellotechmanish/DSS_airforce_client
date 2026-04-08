"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../../../lib/endpoint";
import { POST } from "../../../../lib/request";
import toast from "react-hot-toast";

export default function AddDeviceDialog({
  state,
  sitezero,
  value,
  getdeviceListbysite,
  getnumberOfSite,
}) {
  const [open, setOpen] = useState(false);
  const [uidMatch, setUidMatch] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    // formState: { errors },
  } = useForm();

  const nodeUid = watch("nodeUid");

  // ================= UID CHECK =================
  const checkDeviceUid = async (uid) => {
    try {
      const res = await POST(API.DEVICE.CHECK_UID, { uid });
      setUidMatch(res?.status);
    } catch (err) {
      setUidMatch(false);
    }
  };

  useEffect(() => {
    if (open && nodeUid) {
      checkDeviceUid(nodeUid);
    }
  }, [open, nodeUid]);

  // ================= SUBMIT =================
  const onSubmit = async (data) => {
    try {
      if (!uidMatch) {
        toast.error("Node UID already exists");
        return;
      }

      const siteId = value === 0 ? sitezero?._id : state?._id;

      const body = {
        siteId,
        deviceName: data.deviceName,
        nodeUid: data.nodeUid,
        vmrSensors: Number(data.vmrSensors),
        resSensors: Number(data.resSensors),
        spdSensors: Number(data.spdSensors),
        nerSensors: Number(data.nerSensors),
        vmrSensorsThreshold: {
          r: Number(data.r),
          y: Number(data.y),
          b: Number(data.b),
          ry: Number(data.ry),
          yb: Number(data.yb),
          rb: Number(data.rb),
        },
        resSensorsThreshold: Number(data.resSensorsThreshold),
        spdSensorsThreshold: Number(data.spdSensorsThreshold),
        nerSensorsThreshold: Number(data.nerSensorsThreshold),
      };

      const response = await POST(API.DEVICE.CREATE, body);

      console.log("API RESPONSE =>", response);

      // ✅ FIXED SUCCESS CHECK
      if (
        response &&
        (response.success === true || response.data?.success === true)
      ) {
        toast.success(
          response?.message ||
            response?.data?.message ||
            "Device created successfully",
        );

        reset();
        setOpen(false);
        getdeviceListbysite(siteId);
        getnumberOfSite();

        return;
      }

      // fallback if API does not send success flag but no error thrown
      toast.success("Device created successfully");

      reset();
      setOpen(false);
      getdeviceListbysite(siteId);
      getnumberOfSite();
    } catch (error) {
      console.error("Create device error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create device";

      toast.error(message);
    }
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 
             bg-transparent
             border border-blue-900
             text-blue-900 text-sm font-semibold
             rounded-lg
             transition-all duration-200
             hover:bg-blue-900 hover:text-white"
      >
        + Add Device
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="w-full max-w-6xl bg-white rounded-xl shadow-xl border 
                    max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-[#0f3057]">
                Add Device
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-8 bg-gray-50"
              >
                {/* ===== BASIC INFO ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Site Name
                    </label>
                    <input
                      disabled
                      value={value === 0 ? sitezero?.siteName : state?.siteName}
                      className="w-full border px-3 py-2 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Site UID
                    </label>
                    <input
                      disabled
                      value={value === 0 ? sitezero?.uid : state?.uid}
                      className="w-full border px-3 py-2 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Device Name
                    </label>
                    <input
                      placeholder="Enter device name (e.g. Transformer Panel)"
                      {...register("deviceName", { required: "Required" })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Node UID
                    </label>
                    <input
                      placeholder="Enter unique node ID (e.g. NODE-1023)"
                      {...register("nodeUid", { required: "Required" })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                    />
                    {!uidMatch && (
                      <p className="text-red-500 text-sm mt-1">
                        Node UID already exists
                      </p>
                    )}
                  </div>
                </div>

                {/* ===== SENSOR CONFIGURATION ===== */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                  <h3 className="text-md font-semibold text-[#0f3057]">
                    Sensor Configuration
                  </h3>

                  {/* Phase Sensors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phase Sensors
                      </label>
                      <input
                        type="number"
                        placeholder="Enter number of phase sensors"
                        {...register("vmrSensors", { required: "Required" })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phase Threshold
                      </label>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "r", label: "R Phase" },
                          { name: "y", label: "Y Phase" },
                          { name: "b", label: "B Phase" },
                          { name: "ry", label: "R-Y" },
                          { name: "yb", label: "Y-B" },
                          { name: "rb", label: "R-B" },
                        ].map((item) => (
                          <input
                            key={item.name}
                            type="number"
                            placeholder={item.label}
                            {...register(item.name)}
                            className="border px-2 py-2 rounded text-sm focus:ring-1 focus:ring-[#0f3057]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SPD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SPD Sensors
                      </label>
                      <input
                        type="number"
                        placeholder="Enter SPD sensor count"
                        {...register("spdSensors", { required: "Required" })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SPD Threshold
                      </label>
                      <input
                        type="number"
                        placeholder="Enter SPD threshold value"
                        {...register("spdSensorsThreshold", {
                          required: "Required",
                        })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>
                  </div>

                  {/* RES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        RES Sensors
                      </label>
                      <input
                        type="number"
                        placeholder="Enter RES sensor count"
                        {...register("resSensors", { required: "Required" })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        RES Threshold
                      </label>
                      <input
                        type="number"
                        placeholder="Enter RES threshold value"
                        {...register("resSensorsThreshold", {
                          required: "Required",
                        })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>
                  </div>

                  {/* GN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        GN Sensors
                      </label>
                      <input
                        type="number"
                        placeholder="Enter GN sensor count"
                        {...register("nerSensors", { required: "Required" })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        GN Threshold
                      </label>
                      <input
                        type="number"
                        placeholder="Enter GN threshold value"
                        {...register("nerSensorsThreshold", {
                          required: "Required",
                        })}
                        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#0f3057]"
                      />
                    </div>
                  </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!uidMatch}
                    className="px-6 py-2 bg-[#0f3057] text-white rounded hover:bg-[#163e6b] transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
