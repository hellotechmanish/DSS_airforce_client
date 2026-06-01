import { useEffect, useState, useRef, useCallback } from "react";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
import SiteList from "../../components/auth/siteList";
import DeviceList from "../../components/auth/DeviceList";
import type { SiteType, DeviceType } from "../../Types/type";

const HomePage = () => {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  // console.log("devicesdevices", devices);

  // Track selected device globally if needed, otherwise this prevents the 'not a function' error
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [refreshKey, setRefreshKey] = useState({ sites: 0, devices: 0 });

  const isInitialMount = useRef<boolean>(true);
  const lastFetchId = useRef<number>(0);

  // 1. Sites Fetching Logic
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const resp = await GET(`${API.SITE.COUNT}?page=1&limit=50`);
        if (resp?.data) {
          setSites(resp.data);
          if (resp.data.length > 0 && isInitialMount.current) {
            setSelectedSiteId(resp.data[0]._id);
            isInitialMount.current = false;
          }
        }
      } catch (e) {
        console.error("Fetch Sites Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, [refreshKey.sites]);

  // 2. Devices Fetching Logic
  useEffect(() => {
    if (!selectedSiteId) return;
    const fetchId = ++lastFetchId.current;
    setLoadingDevices(true);

    const getDevices = async () => {
      try {
        const url = API.DEVICE.LIST_BY_SITEID(selectedSiteId);
        const resp = await GET(`${url}?t=${Date.now()}`);

        if (fetchId === lastFetchId.current) {
          setDevices(resp?.data || []);
        }
      } catch (e) {
        if (fetchId === lastFetchId.current) setDevices([]);
        console.error("Fetch Devices Error:", e);
      } finally {
        if (fetchId === lastFetchId.current) setLoadingDevices(false);
      }
    };
    getDevices();
  }, [selectedSiteId, refreshKey.devices]);

  // 3. Selection Handler (Passed as prop to fix the crash)
  const handleDeviceSelection = useCallback((id: string) => {
    setSelectedDeviceId(id);
    // console.log("Current Device selected in Parent:", id);
  }, []);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
        <div className="font-bold text-blue-600 animate-pulse uppercase text-xs tracking-widest">
          Initializing Command Center...
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-slate-50 p-6 gap-6 overflow-hidden">
      {/* TOP SITES BAR */}
      <SiteList
        sites={sites}
        selectedSiteId={selectedSiteId}
        setSelectedSiteId={(id) => {
          setSelectedSiteId(id);
          // Reset device selection when site changes to avoid stale ID
          setSelectedDeviceId("");
        }}
        onRefresh={() =>
          setRefreshKey((prev) => ({ ...prev, sites: prev.sites + 1 }))
        }
      />

      {/* MAIN MONITORING AREA */}
      <DeviceList
        key={`devices-for-${selectedSiteId}`} // Remount on site change to reset internal states
        devices={devices}
        loading={loadingDevices}
        selectedSite={sites.find((s) => s._id === selectedSiteId)}
        onDeviceSelect={handleDeviceSelection} // <--- Prop pass kiya
        onRefresh={() =>
          setRefreshKey((prev) => ({ ...prev, devices: prev.devices + 1 }))
        }
      />
    </div>
  );
};

export default HomePage;
