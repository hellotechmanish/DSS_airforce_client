"use client";

import React, { useState, useEffect } from "react";

import DeviceTab from "./HomePageTab/Devicetab/Device";
import NodataFound from "../../assets/img/nodatafound.png";
import AddDevice from "./HomePageTab/AddDevice/AddDevice";
import AddSiteDialog from "./Managment/SitesMgt/AddSite/SitesAddDialog";
import { getUser } from "../../context/useAuth";

import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";

function App() {
  const [, setLoading] = useState(false);

  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);

  const [sites, setSites] = useState([]);
  const [sitesID, setSitesID] = useState(null);

  const [selectSiteData, setSelectSiteData] = useState(null);
  const [sitezero, setSiteZero] = useState(null);

  const [deviceID, setDevice] = useState([]);

  const user = getUser();

  // console.log("sites", sites[0]);

  // console.log("deviceID", deviceID);

  // ================= SITE FETCH =================

  const getnumberOfSite = async () => {
    try {
      setLoading(true);

      const resp = await GET(API.SITE.COUNT);

      if (Array.isArray(resp?.msg) && resp.msg.length > 0) {
        setSites(resp.msg);

        // 🔹 first site with devices
        const firstActiveSite =
          resp.msg.find((site) => site.deviceCount > 0) || resp.msg[0];
        console.log("firstActiveSite?._id", firstActiveSite?._id);

        setSitesID(firstActiveSite?._id);
        setSiteZero(firstActiveSite);
        setSelectSiteData(firstActiveSite);

        const index = resp.msg.findIndex(
          (site) => site._id === firstActiveSite._id,
        );

        setValue(index);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DEVICE FETCH =================

  const getdeviceListbysite = async (siteId) => {
    if (!siteId) return;

    console.log("siteId from getdeviceListbysite", siteId);

    try {
      setLoading(true);

      const resp = await GET(API.DEVICE.LIST_BY_SITEID(siteId));

      console.log("resp from getdeviceListbysite", resp);

      setDevice(Array.isArray(resp?.msg) ? resp.msg : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECTS =================

  useEffect(() => {
    getnumberOfSite();
  }, []);

  useEffect(() => {
    // console.log("sitesID from useEffect", sitesID);

    if (sitesID) {
      getdeviceListbysite(sitesID);
    }
  }, [sitesID]);

  useEffect(() => {
    setValue1(0);
  }, [value, deviceID]);

  // ================= TAB CHANGE =================

  const TabChange = (index) => {
    setValue(index);

    const selectedSite = sites[index];

    setSelectSiteData(selectedSite);

    setSitesID(selectedSite?._id);
  };

  // ================= UI =================

  return (
    <div className="mx-auto px-4 py-6">
      {sites?.length > 0 ? (
        <>
          {/* ================= SITE SECTION ================= */}

          <div
            className="rounded-xl p-5 mb-6 
            bg-gradient-to-r from-[#0a192f] to-[#0f3057] 
            shadow-lg border border-[#1f4068]"
          >
            <div className="flex justify-between items-center">
              <div className="flex overflow-x-auto gap-4 scrollbar-hide">
                {sites.map((site, index) => (
                  <button
                    key={site._id}
                    onClick={() => TabChange(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                    transition-all duration-200 font-medium text-sm
                    ${
                      value === index
                        ? "bg-white text-[#0f3057] shadow-md"
                        : "bg-[#1f4068] text-white hover:bg-[#274c77]"
                    }`}
                  >
                    <span>{site.siteName}</span>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold
                      ${
                        value === index
                          ? "bg-[#0f3057] text-white"
                          : "bg-white text-[#0f3057]"
                      }`}
                    >
                      {site.deviceCount}
                    </span>
                  </button>
                ))}
              </div>

              {user?.role !== "user" && user?.role !== "technician" && (
                <AddSiteDialog
                  getnumberOfSite={getnumberOfSite}
                  buttonClass="px-5 py-2 
                  bg-transparent
                  border border-white
                  text-white text-sm font-semibold 
                  rounded-lg
                  transition-all duration-200
                  hover:bg-blue-900 hover:text-white"
                />
              )}
            </div>
          </div>

          {/* ================= DEVICE SECTION ================= */}

          <div className="bg-white rounded-xl shadow border p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#0f3057]">Devices</h2>

              {user?.role !== "user" && user?.role !== "technician" && (
                <AddDevice
                  getnumberOfSite={getnumberOfSite}
                  getdeviceListbysite={getdeviceListbysite}
                  state={selectSiteData}
                  sitezero={sitezero}
                  value={value}
                />
              )}
            </div>

            {/* Device List */}

            {deviceID?.length > 0 ? (
              <DeviceTab
                deviceID={deviceID}
                value1={value1}
                setValue1={setValue1}
              />
            ) : (
              // <div></div>
              <div className="flex flex-col items-center justify-center py-16">
                <img
                  src={NodataFound}
                  alt="No Device"
                  className="w-48 opacity-70"
                />

                <p className="mt-4 text-gray-600">No Device found</p>

                {user?.role !== "user" && user?.role !== "technician" && (
                  <div className="mt-4">
                    <AddDevice
                      getnumberOfSite={getnumberOfSite}
                      getdeviceListbysite={getdeviceListbysite}
                      state={selectSiteData}
                      sitezero={sitezero}
                      value={value}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <img src={NodataFound} alt="No Site" className="w-52 opacity-70" />

          <p className="mt-4 text-gray-600">No Site found</p>

          {user?.role !== "user" && user?.role !== "technician" && (
            <div className="mt-4">
              <AddSiteDialog
                getnumberOfSite={getnumberOfSite}
                buttonClass="px-5 py-2 
                bg-blue-400
                border border-white-900
                text-white text-sm font-semibold bg-blue-800
                rounded-lg
                transition-all duration-200
                hover:bg-blue-900 hover:text-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
