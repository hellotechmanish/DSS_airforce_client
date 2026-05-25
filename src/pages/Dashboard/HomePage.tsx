import { useEffect, useState } from "react";

import AddSiteModal from "../../components/auth/modals/addSiteModal";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
import DeviceList from "../../components/auth/DeviceList";
import AddDeviceModal from "../../components/auth/modals/addDeviceModal";
import SiteList from "../../components/auth/siteList";

// ================= TYPES =================

type Site = {
  _id: string;
  siteUid: string;
  siteName: string;
  deviceCount: number;
};

// ================= COMPONENT =================

const HomePage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  console.log("sites", sites);

  console.log("loading", loading);
  console.log("error", error);
  const [selectedSiteUid, setSelectedSiteUid] =
    useState<string>("");
  const [deviceRefreshKey, setDeviceRefreshKey] = useState(0);

  const selectedSiteName =
    sites.find((site) => site.siteUid === selectedSiteUid)?.siteName ?? "";

  // ================= FETCH SITES =================

  const getSites = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const resp = await GET(
        `${API.SITE.COUNT}?page=${page}&limit=10`
      );

      console.log("resp", resp);

      setLoading(false);

      if (Array.isArray(resp?.data)) {
        setSites(resp.data);

        // default selected site
        if (resp.data.length > 0) {
          const firstActiveSite =
            resp.data.find(
              (site: Site) => site.deviceCount > 0
            ) || resp.data[0];

          setSelectedSiteUid(firstActiveSite.siteUid);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        await getSites();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* ================= SITES ================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Sites
          </h2>

          <AddSiteModal getnumberOfSite={getSites} />
        </div>

        <SiteList
          sites={sites}
          selectedSiteUid={selectedSiteUid}
          setSelectedSiteUid={setSelectedSiteUid}
        />
      </div>

      {/* ================= DEVICES ================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Devices
          </h2>

          {/* OPEN EXISTING DEVICE MODAL */}
          <AddDeviceModal
            siteUid={selectedSiteUid}
            siteName={selectedSiteName}
            onDeviceAdded={() =>
              setDeviceRefreshKey((key) => key + 1)
            }
          />
        </div>

        <DeviceList
          siteUid={selectedSiteUid}
          refreshKey={deviceRefreshKey}
        />

        
      </div>
    </div>
  );
};

export default HomePage;
