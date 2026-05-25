import { useEffect, useState } from "react";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";

type Device = {
  _id: string;
  name: string;
};

interface Props {
  siteUid: string;
  refreshKey?: number;
}

const DeviceList = ({ siteUid, refreshKey = 0 }: Props) => {
  console.log("siteUid device list", siteUid);

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  console.log("devices device list", devices);
  console.log("loading device list", loading);
  // ================= GET DEVICES =================

  const getDevices = async () => {
    try {
      setLoading(true);

      // API CALL
      const resp = await GET(
        `${API.DEVICE.LIST_BY_SITEID(siteUid)}`
      );

      console.log("resp device list", resp);

      if (Array.isArray(resp?.data)) {
        setDevices(resp.data);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error(error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await getDevices();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [siteUid, refreshKey]);

  // ================= UI =================

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <div
          key={device._id}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            transition
            hover:shadow-md
          "
        >
          <h3 className="text-lg font-semibold text-slate-800">
            {device.name}
          </h3>
        </div>
      ))}
      {devices.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No Devices Found
        </div>
      )}
    </div>
  );
};

export default DeviceList;