import { useState, useEffect } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Cpu,
  MonitorOff,
  Terminal,
  Zap,
  Radio,
  Thermometer,
  Droplets,
  Calendar, // Missing Import Fixed
  Download, // Missing Import Fixed
} from "lucide-react";
import type { DeviceType } from "../../Types/type";
import AddDeviceModal from "./modals/addDeviceModal";
import { API } from "../../lib/endpoint";
import DeviceGraph from "./Devicegraph";

interface SelectedSite {
  siteUid?: string;
  _id?: string;
  siteName?: string;
}

interface Props {
  devices: DeviceType[];
  loading: boolean;
  selectedSite?: SelectedSite;
  rememberedDeviceId?: string;
  onDeviceSelect: (id: string) => void;
  onRefresh: () => void;
}

const DEVICES_PER_PAGE = 10;

const DeviceList = ({
  devices,
  loading,
  selectedSite,
  rememberedDeviceId,
  onDeviceSelect,
  onRefresh,
}: Props) => {
  const [page, setPage] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  // States for Filter and CSV
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const defaultDevice =
    devices.find((d) => d._id === rememberedDeviceId) || devices[0];
  const derivedSelectedDeviceId = selectedDeviceId || defaultDevice?._id || "";
  const currentDevice = devices.find((d) => d._id === derivedSelectedDeviceId);

  useEffect(() => {
    if (!derivedSelectedDeviceId) return;
    onDeviceSelect(derivedSelectedDeviceId);
  }, [derivedSelectedDeviceId, onDeviceSelect]);

  const currentSensorCounts = currentDevice?.sensorCounts ?? {
    temperature: 0,
    humidity: 0,
    res: 0,
    vmr: 0,
    spd: 0,
    ner: 0,
  };

  const sensorInventory = [
    { id: "TEMP", count: currentSensorCounts.temperature },
    { id: "HUM", count: currentSensorCounts.humidity },
    { id: "RES", count: currentSensorCounts.res },
    { id: "VMR", count: currentSensorCounts.vmr },
    { id: "SPD", count: currentSensorCounts.spd },
    { id: "NER", count: currentSensorCounts.ner },
  ];

  const defaultSensor =
    sensorInventory.find((s) => Number(s.count) > 0)?.id ?? null;
  const effectiveActiveSensor =
    activeSensor &&
    sensorInventory.some((s) => s.id === activeSensor && Number(s.count) > 0)
      ? activeSensor
      : defaultSensor;

  const totalPages = Math.ceil(devices.length / DEVICES_PER_PAGE);
  const visibleDevices = devices.slice(
    page * DEVICES_PER_PAGE,
    (page + 1) * DEVICES_PER_PAGE,
  );

  console.log(
    "data of did and sensor",
    currentDevice?._id,
    effectiveActiveSensor,
  );

  // CSV Download Logic
  const downloadCSV = () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Please select both Start and End dates.");
      return;
    }
    if (!effectiveActiveSensor) {
      alert("Please select a sensor node first.");
      return;
    }

    // Construct Download URL
    const url = `${API.DEVICE.DOWNLOAD_CSV}?deviceId=${derivedSelectedDeviceId}&type=${effectiveActiveSensor}&start=${dateRange.start}&end=${dateRange.end}`;
    window.open(url, "_blank");
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse text-xs font-black">
        <Activity className="mr-2 animate-spin" size={16} /> INITIALIZING
        HARDWARE NODES...
      </div>
    );

  return (
    <div className="flex-1 flex gap-4 overflow-hidden h-[calc(100vh-180px)] min-h-125">
      {/* ─── LEFT SIDEBAR: FIXED WIDTH DEVICES ─── */}
      <div className="w-65 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden shrink-0 h-full">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
            DEVICES
          </span>
          <AddDeviceModal
            siteUid={selectedSite?.siteUid ?? ""}
            site_id={selectedSite?._id ?? ""}
            siteName={selectedSite?.siteName ?? ""}
            onDeviceAdded={onRefresh}
          />
        </div>

        {/* Scrollable Device Node List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar bg-white">
          {devices.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <MonitorOff size={32} className="mb-2" />
              <p className="text-[9px] font-black uppercase tracking-tighter">
                No Nodes Found
              </p>
            </div>
          ) : (
            visibleDevices.map((device) => {
              const isSelected = derivedSelectedDeviceId === device._id;
              return (
                <button
                  key={device._id}
                  title={device.deviceName}
                  onClick={() => {
                    setSelectedDeviceId(device._id);
                    onDeviceSelect(device._id);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "bg-blue-600 border-blue-700 text-white shadow-md translate-x-1"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300 hover:bg-white"
                  }`}
                >
                  <Cpu
                    size={14}
                    className={`shrink-0 ${isSelected ? "text-white" : "text-blue-500"}`}
                  />
                  <span className="text-[11px] font-black uppercase truncate text-left flex-1">
                    {device.deviceName}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Sidebar Pagination: Locked Bottom */}
        {totalPages > 1 && (
          <div className="p-3 border-t bg-slate-50/50 flex items-center justify-between shrink-0">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 hover:bg-white rounded-md disabled:opacity-20 border border-slate-200 shadow-sm transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] font-black text-slate-400">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 hover:bg-white rounded-md disabled:opacity-20 border border-slate-200 shadow-sm transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ─── RIGHT MAIN AREA: AUTO-FIT SYSTEM ─── */}
      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-950 shadow-inner relative flex flex-col overflow-hidden min-w-0 h-full">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] background-size:24px_24px"></div>

        {currentDevice ? (
          <>
            {/* HEADER: IDENTITY & HISTORY FILTER */}
            <div className="px-6 py-4 bg-slate-900/50 border-b border-white/5 flex items-center justify-between z-10 backdrop-blur-md shrink-0 gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Terminal size={18} className="text-blue-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider truncate">
                    {currentDevice.deviceName}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono shrink-0">
                    ID: {currentDevice._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* CALENDAR & DOWNLOAD */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar size={14} className="text-slate-500" />
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="bg-transparent text-[10px] text-slate-300 outline-none cursor-pointer color-scheme:dark"
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                    />
                    <span className="text-slate-600 font-bold text-[10px]">
                      to
                    </span>
                    <input
                      type="date"
                      className="bg-transparent text-[10px] text-slate-300 outline-none cursor-pointer color-scheme:dark"
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all shadow-lg active:scale-95"
                >
                  <Download size={14} /> EXPORT CSV
                </button>

                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT BODY */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
              {/* SENSOR TOGGLES */}
              <div className="flex flex-wrap items-center gap-2 mb-4 shrink-0">
                {[
                  {
                    deviceName: "TEMP",
                    count: currentSensorCounts.temperature,
                    icon: Thermometer,
                    color: "text-rose-400",
                  },
                  {
                    deviceName: "HUM",
                    count: currentSensorCounts.humidity,
                    icon: Droplets,
                    color: "text-cyan-400",
                  },
                  {
                    deviceName: "RES",
                    count: currentSensorCounts.res,
                    icon: Zap,
                    color: "text-orange-400",
                  },
                  {
                    deviceName: "VMR",
                    count: currentSensorCounts.vmr,
                    icon: Activity,
                    color: "text-purple-400",
                  },
                  {
                    deviceName: "SPD",
                    count: currentSensorCounts.spd,
                    icon: Radio,
                    color: "text-blue-400",
                  },
                  {
                    deviceName: "NER",
                    count: currentSensorCounts.ner,
                    icon: Cpu,
                    color: "text-emerald-400",
                  },
                ].map(
                  (s) =>
                    Number(s.count) > 0 && (
                      <button
                        key={s.deviceName}
                        onClick={() => setActiveSensor(s.deviceName)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                          effectiveActiveSensor === s.deviceName
                            ? "bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30"
                            : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <s.icon
                            size={11}
                            className={
                              effectiveActiveSensor === s.deviceName
                                ? "text-blue-400"
                                : s.color
                            }
                          />
                          <span
                            className={`text-[8px] font-black tracking-tight ${effectiveActiveSensor === s.deviceName ? "text-blue-400" : s.color}`}
                          >
                            {s.deviceName}
                          </span>
                        </div>
                        {/* <div className="h-3 w-3 bg-white/10" /> */}
                        <span className="text-[10px] font-black font-mono leading-none">
                          {s.count}
                        </span>
                      </button>
                    ),
                )}
              </div>

              {/* MAIN VISUALIZATION BOX */}
              <div className="flex-1 border border-white/5 bg-slate-900/40 rounded-3xl flex flex-col relative overflow-hidden group w-full min-h-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient from-transparent via-blue-500/50 to-transparent"></div>

                {/* DeviceList.tsx mein niche wala part update karein */}
                {effectiveActiveSensor ? (
                  <div className="w-full h-full p-4 flex flex-col overflow-hidden">
                    <DeviceGraph
                      // Ye key add karne se props refresh ho jayenge
                      key={`${currentDevice._id}-${effectiveActiveSensor}`}
                      deviceId={currentDevice._id}
                      sensorName={effectiveActiveSensor}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center m-auto p-8 text-center text-slate-600 opacity-20">
                    <Activity size={48} className="mb-4" />
                    <h4 className="text-sm font-black uppercase tracking-[0.4em]">
                      Initializing Sensors...
                    </h4>
                  </div>
                )}

                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10 bg-slate-950/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
                  <span className="text-[9px] font-black text-slate-500 uppercase">
                    Status:
                  </span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 h-full">
            <MonitorOff size={64} className="text-white mb-4" />
            <span className="text-sm font-black uppercase tracking-[0.8em] text-white">
              Standby Mode
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceList;
