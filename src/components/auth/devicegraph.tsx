import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Activity } from "lucide-react";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
import { AgCharts } from "ag-charts-react";
import {
  LineSeriesModule,
  ModuleRegistry,
  NumberAxisModule,
  TimeAxisModule,
} from "ag-charts-community";
import type { AgCartesianChartOptions } from "ag-charts-community";

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

interface SensorReading {
  value: number | null;
  timestamp: string | null;
  isLive: boolean;
}

interface SensorDataResponse {
  success?: boolean;
  status?: boolean;
  data?: Array<{
    createdAt: string;
    dataStreams?: Array<{ value?: number | string }>;
    value?: number | string;
  }>;
}

const DeviceGraph = ({
  deviceId,
  sensorName,
  onReadingChange,
}: {
  deviceId: string;
  sensorName: string;
  onReadingChange?: (reading: SensorReading) => void;
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

        const resp = await GET<SensorDataResponse>(endpoint);
        console.log("live data ", resp);

        const rows = resp?.data ?? [];

        if ((resp?.success || resp?.status) && rows.length > 0) {
          const newPoints: DataPoint[] = rows
            .map((item) => ({
              time: new Date(item.createdAt),
              value: Number(item.dataStreams?.[0]?.value ?? item.value ?? 0),
              rawTime: item.createdAt,
            }))
            .filter(
              (point) =>
                Number.isFinite(point.value) &&
                !Number.isNaN(point.time.getTime()),
            )
            .sort((a, b) => a.time.getTime() - b.time.getTime());

          if (newPoints.length === 0) {
            onReadingChange?.({
              value: null,
              timestamp: null,
              isLive: false,
            });
            return;
          }

          const latestPoint = newPoints[newPoints.length - 1];
          onReadingChange?.({
            value: latestPoint.value,
            timestamp: latestPoint.rawTime,
            isLive: true,
          });

          lastTimestampRef.current = latestPoint.rawTime;

          setData((prev) => {
            const combined: DataPoint[] = isInitial
              ? newPoints
              : [...prev, ...newPoints];
            const unique = Array.from(
              new Map(combined.map((point) => [point.rawTime, point])).values(),
            ).sort((a, b) => a.time.getTime() - b.time.getTime());
            return unique.slice(-50);
          });
        } else {
          onReadingChange?.({
            value: null,
            timestamp: null,
            isLive: false,
          });
        }
      } catch (e) {
        onReadingChange?.({
          value: null,
          timestamp: null,
          isLive: false,
        });
        console.error("Graph Sync Error:", e);
      }
    },
    [deviceId, sensorName, onReadingChange],
  );

  useEffect(() => {
    setLoading(true);
    fetchStreamData(true).then(() => setLoading(false));
    const interval = setInterval(() => fetchStreamData(false), 3000);
    return () => clearInterval(interval);
  }, [fetchStreamData]);

  // Use useMemo to prevent re-calculating options unless data changes
  const options = useMemo(
    (): AgCartesianChartOptions<DataPoint> => ({
      data: data,
      animation: {
        enabled: true,
        duration: 1000,
      },
      theme: {
        baseTheme: "ag-vivid-dark", // Better for dark backgrounds
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
            strokeWidth: 1.5,
            size: 5,
            itemStyler: ({ last }) =>
              last
                ? {
                    fill: "#facc15",
                    stroke: "#ffffff",
                    strokeWidth: 4,
                    size: 13,
                  }
                : {
                    fill: "#3b82f6",
                    stroke: "#dbeafe",
                    strokeWidth: 1.5,
                    size: 5,
                  },
          },
        },
      ],
      axes: {
        x: {
          type: "time",
          position: "bottom",
          nice: false, // Prevents axis from jumping around
          label: {
            format: "%H:%M:%S",
            color: "#94a3b8",
            fontSize: 11,
            minSpacing: 70,
          },
          interval: {
            minSpacing: 75,
            maxSpacing: 160,
          },
        },
        y: {
          type: "number",
          position: "left",
          label: { color: "#94a3b8" },
          gridLine: {
            style: [{ stroke: "rgba(255, 255, 255, 0.05)", lineDash: [4, 4] }],
          },
        },
      },
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
    <div className="h-[400px] w-full p-4  bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <AgCharts options={options} />
    </div>
  );
};

export default DeviceGraph;
