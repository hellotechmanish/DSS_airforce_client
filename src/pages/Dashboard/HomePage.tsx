import { useCallback, useEffect, useState, useRef } from "react";
import AddSiteModal from "../../components/auth/modals/addSiteModal";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
import DeviceList from "../../components/auth/DeviceList";
import AddDeviceModal from "../../components/auth/modals/addDeviceModal";
import SiteList from "../../components/auth/siteList";

type Site = {
  _id: string;
  siteUid: string;
  siteName: string;
  deviceCount: number;
};

const HomePage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [deviceRefreshKey, setDeviceRefreshKey] = useState(0);
  const [lastSelectedDeviceMap, setLastSelectedDeviceMap] = useState<
    Record<string, string>
  >({});

  // Use a ref to prevent unnecessary re-fetches if getSites is passed to children
  const isInitialMount = useRef(true);

  const selectedSite = sites.find((site) => site._id === selectedSiteId);

  // Memoize getSites to avoid effect dependency loops
  const getSites = useCallback(async (page = 1) => {
    try {
      const resp = await GET(`${API.SITE.COUNT}?page=${page}&limit=50`);

      if (Array.isArray(resp?.data)) {
        const normalizedSites = resp.data.map((site: Site) => ({
          ...site,
          siteUid: site.siteUid || site._id || "",
        }));

        setSites(normalizedSites);

        // Logic: If no site is selected, pick the first one
        if (normalizedSites.length > 0 && isInitialMount.current) {
          setSelectedSiteId(normalizedSites[0]._id);
          isInitialMount.current = false;
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, []); // dependencies are empty because GET and API are constants

  // Single useEffect for initialization
  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      setLoading(true);
      await getSites();
      if (isMounted) setLoading(false);
    };

    initFetch();
    return () => {
      isMounted = false;
    };
  }, [getSites]);

  const handleDeviceSelect = useCallback(
    (siteId: string, deviceId: string) => {
      setLastSelectedDeviceMap((prev) => ({ ...prev, [siteId]: deviceId }));
    },
    [],
  );

  const handleDeviceSelectByCurrentSite = useCallback(
    (deviceId: string) => {
      if (!selectedSiteId) return;
      handleDeviceSelect(selectedSiteId, deviceId);
    },
    [selectedSiteId, handleDeviceSelect],
  );

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 font-medium italic">
        Initializing Dashboard...
      </div>
    );

  return (
    <div className=" mx-auto space-y-6 p-4 animate-in fade-in duration-500">
      {/* SITES SECTION */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Site Management
          </h2>
          <AddSiteModal getnumberOfSite={getSites} />
        </div>
        <SiteList
          sites={sites}
          selectedSiteId={selectedSiteId}
          setSelectedSiteId={setSelectedSiteId}
        />
      </div>

      {/* DEVICES SECTION */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none">
              Devices
            </h2>
            <p className="text-[11px] text-blue-500 font-medium mt-1 uppercase tracking-tighter">
              Currently Viewing: {selectedSite?.siteName || "Select a site"}
            </p>
          </div>
          <AddDeviceModal
            siteUid={selectedSite?.siteUid || ""}
            site_id={selectedSiteId}
            siteName={selectedSite?.siteName || ""}
            onDeviceAdded={() => setDeviceRefreshKey((k) => k + 1)}
          />
        </div>

        {selectedSiteId ? (
          <DeviceList
            site_id={selectedSiteId}
            refreshKey={deviceRefreshKey}
            rememberedDeviceId={lastSelectedDeviceMap[selectedSiteId]}
            onDeviceSelect={handleDeviceSelectByCurrentSite}
          />
        ) : (
          <div className="py-10 text-center text-slate-400 text-sm">
            Please select a site to view devices.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
