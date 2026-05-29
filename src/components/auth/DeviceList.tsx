import { useEffect, useState } from "react";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
import { ChevronLeft, ChevronRight, Cpu, MonitorOff } from "lucide-react";

type Device = {
  _id: string;
  deviceName: string;
  site_id: string;
};

interface Props {
  site_id: string;
  refreshKey?: number;
  rememberedDeviceId?: string;
  onDeviceSelect: (id: string) => void;
}

const DEVICES_PER_PAGE = 6;

const DeviceList = ({
  site_id,
  refreshKey,
  rememberedDeviceId,
  onDeviceSelect,
}: Props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // ================= FETCH LOGIC =================

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDevices = async () => {
      // Immediate cleanup on site change
      if (!site_id) {
        setDevices([]);
        setSelectedDeviceId("");
        onDeviceSelect("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setDevices([]);
        setSelectedDeviceId("");

        const url = `${API.DEVICE.LIST_BY_SITEID(site_id)}${
          API.DEVICE.LIST_BY_SITEID(site_id).includes("?") ? "&" : "?"
        }t=${Date.now()}`;

        const resp = await GET(url, {}, { signal });
        const list = Array.isArray(resp?.data) ? resp.data : [];

        if (signal.aborted) return;

        setDevices(list);
        setPage(0);

        if (list.length === 0) {
          setSelectedDeviceId("");
          onDeviceSelect("");
        } else {
          const savedDevice = list.find(
            (d: Device) => d._id === rememberedDeviceId,
          );
          const targetId = savedDevice ? savedDevice._id : list[0]._id;

          setSelectedDeviceId(targetId);
          onDeviceSelect(targetId);
        }
      } catch (err: any) {
        if (signal.aborted || err?.code === "ERR_CANCELED") return;

        console.error("Device Fetch Error:", err);
        setDevices([]);
        setSelectedDeviceId("");
        onDeviceSelect("");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchDevices();

    return () => {
      controller.abort();
    };
  }, [site_id, refreshKey, onDeviceSelect, rememberedDeviceId]);

  // ================= HANDLERS =================

  const handleDeviceClick = (id: string) => {
    setSelectedDeviceId(id);
    onDeviceSelect(id);
  };

  // ================= RENDER HELPERS =================

  const totalPages = Math.ceil(devices.length / DEVICES_PER_PAGE);
  const visible = devices.slice(
    page * DEVICES_PER_PAGE,
    (page + 1) * DEVICES_PER_PAGE,
  );
  const currentDevice = devices.find((d) => d._id === selectedDeviceId);

  // --- RENDERING ---

  if (loading)
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-xs text-slate-400 font-medium italic">
          Syncing Hardware for Site...
        </p>
      </div>
    );

  if (devices.length === 0)
    return (
      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/40 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-white rounded-full shadow-sm text-slate-300 mb-4">
          <MonitorOff size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-bold text-slate-600">No Hardware Linked</h3>
        <p className="text-[11px] text-slate-400 mt-1">
          Select a different site or add a device.
        </p>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {visible.map((device) => (
            <button
              key={device._id}
              onClick={() => handleDeviceClick(device._id)}
              className={`px-4 py-2 rounded-t-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedDeviceId === device._id
                  ? "bg-blue-600 text-white shadow-sm translate-y-[-2px]"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {device.deviceName}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 px-2 border-l border-slate-100 h-8">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {page + 1}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main Detail View */}
      {currentDevice && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="lg:col-span-1 p-5 rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50/30 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-blue-600 rounded-xl text-white mb-4 shadow-lg">
              <Cpu size={24} />
            </div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              {currentDevice.deviceName}
            </h4>
            <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase">Active</span>
            </div>
          </div>

          <div className="lg:col-span-3 p-6 rounded-2xl border border-slate-100 bg-white flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <p className="text-[11px] text-slate-400 font-medium italic">
              Awaiting real-time stream for node:{" "}
              <span className="text-blue-500 font-bold">
                {currentDevice._id.slice(-6).toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
