"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GET, POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import toast from "react-hot-toast";

const steps = [
  "Personal Info",
  "Assign Site",
  "Assign Device",
  "Assign Sensors",
];

export default function Clusterhead({ setOpen, getnumberOfUser }) {
  const [activeStep, setActiveStep] = useState(0);

  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);

  const [siteLoading, setSiteLoading] = useState(false);
  const [deviceLoading] = useState(false);

  const [selectedSiteIds, setSelectedSiteIds] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const [resValue, setResValue] = useState([]);
  const [spdNumber] = useState([]);
  const [gnNumber] = useState([]);
  const [phaseNumber] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // ================= FETCH SITES =================
  const fetchSites = async () => {
    setSiteLoading(true);

    try {
      const res = await GET(API.SITE.COUNT);
      console.log("this is the site here : ", res.msg);

      setSites(res?.msg || []);
    } catch {
      toast.error("Failed to load sites");
    }

    setSiteLoading(false);
  };

  // ================= FETCH DEVICES =================
  const fetchDevices = async (siteIds) => {
    const res = await POST(API.DEVICE.LIST_BY_SITES, { siteIds });

    console.log("list device : ", res);

    setDevices(res?.msg || []);
  };

  // ================= SITE SELECT =================
  const handleSiteSelect = (siteId) => {
    setSelectedSiteIds((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId],
    );

    setSelectedDevices([]);
  };

  // ================= DEVICE SELECT =================
  const handleDeviceChange = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId],
    );
  };

  // ================= MAP SITE DEVICES =================
  const mapSiteDevices = () => {
    return selectedSiteIds.map((siteId) => {
      const devicesOfSite = devices
        .filter(
          (device) =>
            device.siteId === siteId && selectedDevices.includes(device._id),
        )
        .map((device) => device._id);

      return {
        siteId,
        devices: devicesOfSite,
      };
    });
  };

  // ================= NEXT STEP =================
  const handleNext = async (data) => {
    // STEP 0 → Personal Info → Fetch Sites
    if (activeStep === 0) {
      await fetchSites();
      setActiveStep(1);
      return;
    }

    // STEP 1 → Sites Selected → Fetch Devices
    if (activeStep === 1) {
      if (selectedSiteIds.length === 0) {
        toast.error("Please select at least one site");
        return;
      }

      console.log("Selected Site Ids:", selectedSiteIds);

      await fetchDevices(selectedSiteIds);

      setActiveStep(2);

      return;
    }

    // STEP 2 → Device Validation
    if (activeStep === 2) {
      if (selectedDevices.length === 0) {
        toast.error("Please select at least one device");
        return;
      }

      setActiveStep(3);
      return;
    }

    // STEP 3 → Submit
    if (activeStep === 3) {
      if (resValue.length === 0) {
        toast.error("Please select at least one RES sensor");
        return;
      }

      submitAllData(data);
    }
  };

  // ================= FINAL SUBMIT =================
  const submitAllData = async (data) => {
    const siteDeviceMap = mapSiteDevices();

    const finalPayload = {
      fullName: data.fullName,
      uid: data.uid,
      password: data.password,
      type: "user",

      sites: siteDeviceMap,

      resistanceNumber: resValue,
      spdNumber,
      gnNumber,
      phaseNumber,
    };

    console.log("🔥 FINAL SUBMIT DATA =>", finalPayload);

    try {
      await POST(API.USERS.CREATE, finalPayload);

      toast.success("User created successfully");

      getnumberOfUser();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("User creation failed");
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <div className="w-full p-6">
      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm
              ${
                activeStep >= index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>

            <p className="text-xs mt-2">{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleNext)}>
        {/* STEP 0 */}
        {activeStep === 0 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <input
                {...register("fullName", { required: "Required" })}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">UID</label>
              <input
                {...register("uid", { required: "Required" })}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {activeStep === 1 && (
          <div>
            {siteLoading && <p>Loading Sites...</p>}

            <div className="space-y-2">
              {sites.map((site) => (
                <label
                  key={site._id}
                  className={`flex gap-3 p-3 rounded cursor-pointer
                  ${
                    selectedSiteIds.includes(site._id)
                      ? "bg-[#0f3057] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSiteIds.includes(site._id)}
                    onChange={() => handleSiteSelect(site._id)}
                  />

                  {site.siteName}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <div>
            {deviceLoading && <p>Loading Devices...</p>}

            <div className="space-y-2">
              {devices.map((device) => (
                <label
                  key={device._id}
                  className="flex gap-3 p-2 rounded hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device._id)}
                    onChange={() => handleDeviceChange(device._id)}
                  />

                  {device.deviceName}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() =>
                  setResValue((prev) =>
                    prev.includes(num)
                      ? prev.filter((n) => n !== num)
                      : [...prev, num],
                  )
                }
                className={`px-4 py-2 border rounded
                ${resValue.includes(num) ? "bg-[#0f3057] text-white" : ""}`}
              >
                RES {num}
              </button>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 border rounded"
            >
              Previous
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-[#0f3057] text-white rounded"
          >
            {activeStep === 3 ? "Create User" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
