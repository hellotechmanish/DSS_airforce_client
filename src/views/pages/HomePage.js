"use client";

import React, { useState, useEffect, useRef } from "react";

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const user = getUser();
  const scrollRef = useRef(null);

  // console.log("sitessites", sites);

  // console.log("sites", sites[0]);

  // console.log("deviceID", deviceID);

  // ================= SITE FETCH =================

  const getnumberOfSite = async (page = 1) => {
    try {
      setLoading(true);

      const resp = await GET(`${API.SITE.COUNT}?page=${page}&limit=10`);

      if (Array.isArray(resp?.msg)) {
        setSites(resp.msg);
        setPagination(resp.pagination);

        if (resp.msg.length > 0) {
          const firstActiveSite =
            resp.msg.find((site) => site.deviceCount > 0) || resp.msg[0];
          setSitesID(firstActiveSite?._id);
          setSiteZero(firstActiveSite);
          setSelectSiteData(firstActiveSite);
          const index = resp.msg.findIndex(
            (site) => site._id === firstActiveSite._id,
          );
          setValue(index);
        }
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

      // console.log("resp from getdeviceListbysite", resp);

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

  const scrollTabs = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -500 : 500,
        behavior: "smooth",
      });
    }
  };

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
            {/* ── Header row ── */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Sites</h2>

              {user?.role !== "user" && user?.role !== "technician" && (
                <AddSiteDialog
                  getnumberOfSite={getnumberOfSite}
                  buttonClass="px-4 py-1.5
          border border-white
          text-white text-sm font-semibold
          rounded-lg
          hover:bg-blue-900 transition-colors duration-200"
                />
              )}
            </div>

            {/* ── Tabs + scroll arrows ── */}
            <div className="flex items-center gap-2">
              {/* Left arrow */}
              {/* <button
                onClick={() => scrollTabs("left")}
                className="flex-shrink-0 bg-[#1f4068] text-white
        w-7 h-7 flex items-center justify-center
        rounded-md hover:bg-[#274c77] transition-colors duration-150 text-xs"
              >
                ◀
              </button> */}

              {/* Scrollable tab track */}
              <div
                ref={scrollRef}
                className="flex-1 flex justify-center gap-2 overflow-x-auto scroll-smooth py-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`.tab-track::-webkit-scrollbar{display:none}`}</style>

                {sites.map((site, index) => (
                  <button
                    key={site._id}
                    onClick={() => TabChange(index)}
                    className={`flex-shrink-0 flex items-center gap-6
            px-4 py-2 rounded-lg whitespace-nowrap
            transition-all duration-200 font-medium text-sm
            ${
              value === index
                ? "bg-white text-[#0f3057] shadow-md"
                : "bg-[#1f4068] text-white hover:bg-[#274c77]"
            }`}
                  >
                    <span className="max-w-[200px] truncate">
                      {site.siteName}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0
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

              {/* Right arrow */}
              {/* <button
                onClick={() => scrollTabs("right")}
                className="flex-shrink-0 bg-[#1f4068] text-white
        w-7 h-7 flex items-center justify-center
        rounded-md hover:bg-[#274c77] transition-colors duration-150 text-xs"
              >
                ▶
              </button> */}
            </div>

            {/* ── Pagination controls ── */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1f4068]">
                {/* Page info */}
                <span className="text-sm text-white">
                  Page {pagination.page} of {pagination.totalPages}
                  <span className="ml-2 text-white">
                    ({pagination.total} sites total)
                  </span>
                </span>

                {/* Page buttons */}
                <div className="flex items-center gap-2">
                  {/* First */}
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => getnumberOfSite(1)}
                    className="px-3 py-1.5 rounded text-sm font-medium
        border border-[#274c77] text-white
        disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-[#274c77] transition"
                  >
                    «
                  </button>

                  {/* Prev */}
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => getnumberOfSite(pagination.page - 1)}
                    className="px-3 py-1.5 rounded text-sm font-medium
        border border-[#274c77] text-white
        disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-[#274c77] transition"
                  >
                    ‹
                  </button>

                  {/* Numbered page pills */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter((p) => {
                      const cur = pagination.page;
                      return (
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - cur) <= 1
                      );
                    })
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-blue-400/60 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => getnumberOfSite(p)}
                          className={`w-9 h-9 rounded text-sm font-semibold
              border transition
              ${
                pagination.page === p
                  ? "bg-white text-[#0f3057] border-white"
                  : "border-[#274c77] text-white hover:bg-[#274c77]"
              }`}
                        >
                          {p}
                        </button>
                      ),
                    )}

                  {/* Next */}
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => getnumberOfSite(pagination.page + 1)}
                    className="px-3 py-1.5 rounded text-sm font-medium
        border border-[#274c77] text-white
        disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-[#274c77] transition"
                  >
                    ›
                  </button>

                  {/* Last */}
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => getnumberOfSite(pagination.totalPages)}
                    className="px-3 py-1.5 rounded text-sm font-medium
        border border-[#274c77] text-white
        disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-[#274c77] transition"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= DEVICE SECTION ================= */}

          <div className="bg-white rounded-xl shadow border p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#0f3057]">Devices</h2>

              {user?.role !== "user" && user?.role !== "technician" && (
                <AddDevice
                  getnumberOfSite={getnumberOfSite}
                  getdeviceListbysite={getdeviceListbysite}
                  // getnumberOfSite={getnumberOfSite}
                  // getdeviceListbysite={getdeviceListbysite}
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
