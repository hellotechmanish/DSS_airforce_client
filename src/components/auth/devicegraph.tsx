import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Activity } from "lucide-react";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
// 1. Logic/Classes (Runtime values)
import {
  LineSeriesModule,
  NumberAxisModule,
  TimeAxisModule,
} from "ag-charts-community";

import {
  AgCharts,
  ModuleRegistry,
  type AgChartOptions, // Yahan 'type' add karein
} from "ag-charts-community";

// Register modules
ModuleRegistry.registerModules([
  LineSeriesModule,
  NumberAxisModule,
  TimeAxisModule,
]);

interface DataPoint {
  time: Date;
  value: number;
  rawTime: string;
}

const DeviceGraph = ({
  deviceId,
  sensorName,
}: {
  deviceId: string;
  sensorName: string;
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const lastTimestampRef = useRef<string | null>(null);

  const fetchStreamData = useCallback(
    async (isInitial = false) => {
      try {
        const limit = isInitial ? 50 : 5;
        const since = isInitial ? "" : lastTimestampRef.current;
        const endpoint = `${API.DEVICE.GET_SENSOR_DATA(deviceId)}?type=${sensorName}&limit=${limit}&since=${since}`;

        const resp = await GET(endpoint);

        if (resp?.status && resp.data?.length > 0) {
          const newPoints = resp.data.map((item: any) => ({
            time: new Date(item.createdAt),
            value: Number(item.dataStreams?.[0]?.value ?? item.value ?? 0),
            rawTime: item.createdAt,
          }));

          lastTimestampRef.current = resp.data[resp.data.length - 1].createdAt;

          setData((prev) => {
            const combined = isInitial ? newPoints : [...prev, ...newPoints];
            const unique = combined.filter(
              (v, i, a) => a.findIndex((t) => t.rawTime === v.rawTime) === i,
            );
            return unique.slice(-50);
          });
        }
      } catch (e) {
        console.error("Graph Sync Error:", e);
      }
    },
    [deviceId, sensorName],
  );

  useEffect(() => {
    setLoading(true);
    fetchStreamData(true).then(() => setLoading(false));
    const interval = setInterval(() => fetchStreamData(false), 3000);
    return () => clearInterval(interval);
  }, [fetchStreamData]);

  // Use useMemo to prevent re-calculating options unless data changes
  const options = useMemo(
    (): AgChartOptions => ({
      data: data,
      autoSize: true,
      theme: {
        baseTheme: "ag-vivid-dark", // Better for dark backgrounds
        overrides: {
          line: {
            series: {
              highlightStyle: {
                series: { strokeWidth: 4 },
              },
            },
          },
        },
      },
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "value",
          yName: sensorName,
          stroke: "#3b82f6",
          strokeWidth: 3,
          marker: {
            enabled: true,
            fill: "#3b82f6",
            stroke: "#fff",
            strokeWidth: 2,
            size: 6,
          },
        },
      ],
      axes: [
        {
          type: "time",
          position: "bottom",
          nice: false, // Prevents axis from jumping around
          label: {
            format: "%H:%M:%S",
            color: "#94a3b8",
          },
        },
        {
          type: "number",
          position: "left",
          label: { color: "#94a3b8" },
          gridLine: {
            style: [{ stroke: "rgba(255, 255, 255, 0.05)", lineDash: [4, 4] }],
          },
        },
      ],
      background: { visible: false }, // Use the CSS container background
    }),
    [data, sensorName],
  );

  if (loading)
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Activity className="animate-spin text-blue-500" size={32} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Syncing Stream...
          </span>
        </div>
      </div>
    );

  return (
    <div className="h-[400px] w-full p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <AgCharts options={options} />
    </div>
  );
};

export default DeviceGraph;
