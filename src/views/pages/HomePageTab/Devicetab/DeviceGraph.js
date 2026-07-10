"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
import DewnloadReport from "../../DownloadReport/Downlaod";
import hondaGif from "../../../../assets/img/hondagif.gif";
import { useAuth } from "../../../../context/useAuth";
import { POST } from "../../../../lib/request";
import { API } from "../../../../lib/endpoint";

const BORDER_COLORS = [
  "#FF6384",
  "#E6E600",
  "#33CCFF",
  "#CC33FF",
  "#3CB371",
  "#EE82EE",
  "#FFA500",
  "#6A5A14",
  "#FF6347",
];

const PHASE_LABELS = ["R", "Y", "B", "RY", "YB", "RB"];

const getTempValue = (row) =>
  Number(
    row?.msg?.TempValues?.DATASTREAMS?.[0]?.value ??
      row?.msg?.DATASTREAMS?.[0]?.value ??
      row?.temp ??
      0,
  );

const getHumValue = (row) =>
  Number(
    row?.msg?.HumValues?.DATASTREAMS?.[0]?.value ??
      row?.msg?.DATASTREAMS?.[0]?.value ??
      row?.humidity ??
      0,
  );

export default function Graph({
  device,
  sensor,
  SensorTypeChange,
  intervalId,
}) {
  const user = useAuth((state) => state.user);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [phasevalue, setPhaseValue] = useState(1);
  const [labels, setLabels] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDevice, setUserDevice] = useState([]);

  const PhaseValueChange = (newValue) => setPhaseValue(Number(newValue));

  useEffect(() => {
    const ds = user?.deviceSensors;
    if (!Array.isArray(ds) || !device?._id) {
      setUserDevice(null);
      return;
    }
    const found = ds.find(
      (item) => item?.sensorId?.toString() === device._id?.toString(),
    );
    setUserDevice(found || null);
  }, [user, device?._id]);

  /* ========================================================================
     🚀 AUTO-SELECT DROPDOWN INITIAL VALUE MATRIX
     ======================================================================== */
  const currentSensorCounts = useMemo(
    () => ({
      temperature: Number(device?.temp || 0),
      humidity: Number(device?.humidity || 0),
      res: Number(device?.resSensors || 0),
      vmr: Number(device?.vmrSensors || 0),
      spd: Number(device?.spdSensors || 0),
      ner: Number(device?.nerSensors || 0),
    }),
    [device],
  );

  const sensorInventory = useMemo(
    () => [
      { id: "RES", count: currentSensorCounts.res },
      { id: "VMR", count: currentSensorCounts.vmr },
      { id: "NER", count: currentSensorCounts.ner },
      { id: "SPD", count: currentSensorCounts.spd },
      {
        id: "TEMP",
        count:
          currentSensorCounts.temperature ||
          device?.TempValues?.DATASTREAMS?.length ||
          0,
      },
      {
        id: "HUM",
        count:
          currentSensorCounts.humidity ||
          device?.HumValues?.DATASTREAMS?.length ||
          0,
      },
    ],
    [currentSensorCounts, device],
  );

  useEffect(() => {
    if (!device) return;

    const isValidCurrent =
      sensor &&
      sensorInventory.some((s) => s.id === sensor && Number(s.count) > 0);
    if (isValidCurrent) return;

    const automaticFallbackSensor =
      sensorInventory.find((s) => Number(s.count) > 0)?.id ?? null;
    if (automaticFallbackSensor && typeof SensorTypeChange === "function") {
      SensorTypeChange(automaticFallbackSensor);
    }
  }, [device, sensor, sensorInventory, SensorTypeChange]);

  useEffect(() => {
    if (sensor === "VMR" && Number(device?.vmrSensors || 0) > 0) {
      if (!phasevalue || Number(phasevalue) > Number(device.vmrSensors)) {
        setPhaseValue(1);
      }
    }
  }, [sensor, device, phasevalue]);

  // ====================================================
  //  1. DATASETS SERIES GENERATION ENGINE
  // ====================================================
  const chartSeries = useMemo(() => {
    if (!Array.isArray(graphData) || graphData.length === 0) return [];
    const role = user?.role;

    if (sensor === "RES") {
      const count =
        role === "user"
          ? userDevice?.resistanceNumber?.length ||
            Number(device?.resSensors || 0)
          : Number(device?.resSensors || 0);
      return Array.from({ length: count }, (_, i) => ({
        name: `R${i + 1}`,
        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),
      }));
    }

    if (sensor === "SPD") {
      const count =
        role === "user"
          ? userDevice?.spdNumber?.length || 0
          : Number(device?.spdSensors || 0);
      return Array.from({ length: count }, (_, i) => ({
        name: `SPD${i + 1}`,
        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),
      }));
    }

    if (sensor === "NER") {
      const count =
        role === "user"
          ? userDevice?.gnNumber?.length || Number(device?.nerSensors || 0)
          : Number(device?.nerSensors || 0);
      return Array.from({ length: count }, (_, i) => ({
        name: `GN${i + 1}`,
        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),
      }));
    }

    if (sensor === "VMR") {
      const phaseList =
        role === "user" && Array.isArray(userDevice?.phaseNumber)
          ? PHASE_LABELS.slice(0, userDevice.phaseNumber.length)
          : PHASE_LABELS;
      return phaseList.map((phase) => ({
        name: phase,
        data: graphData
          .filter((item) => item?.phaseNumber === phase.toLowerCase())
          .map((item) => {
            const val = item?.value;
            return val !== undefined && val !== null ? Number(val) : 0;
          }),
      }));
    }

    if (sensor === "TEMP") {
      return [
        {
          name: "T1",
          data: graphData.map((item) => getTempValue(item)),
        },
      ];
    }

    if (sensor === "HUM") {
      return [
        {
          name: "H1",
          data: graphData.map((item) => getHumValue(item)),
        },
      ];
    }

    return [];
  }, [user?.role, device, graphData, sensor, userDevice]);

  // ====================================================
  //  2. APEXCHARTS CONFIGURATION
  // ====================================================
  const chartOptions = useMemo(
    () => ({
      chart: {
        id: "realtime-telemetry-chart",
        type: "line",
        animations: {
          enabled: false,
          easing: "linear",
          dynamicAnimation: {
            speed: 350,
          },
        },
        toolbar: { show: false },
        background: "#ffffff",
      },
      xaxis: {
        categories: labels,
        labels: {
          show: true,
          style: { colors: "#64748b", fontSize: "11px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#64748b" },
          formatter: (val) => {
            if (val === null || val === undefined || isNaN(val)) {
              return "0.00";
            }
            return Number(val).toFixed(2);
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: BORDER_COLORS,
      grid: {
        borderColor: "#f1f5f9",
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
        discrete:
          chartSeries?.map((series) => ({
            seriesIndex: chartSeries.indexOf(series),
            dataPointIndex: (series?.data?.length || 1) - 1,
            fillColor:
              BORDER_COLORS[chartSeries.indexOf(series) % BORDER_COLORS.length],
            strokeColor: "#ffffff",
            size: 6,
            shape: "circle",
          })) || [],
      },
      tooltip: { x: { show: true } },
    }),
    [labels, chartSeries],
  );

  const downloadDataSets = useMemo(() => {
    return chartSeries.map((s, i) => ({
      label: s.name,
      data: s.data,
      borderColor: BORDER_COLORS[i],
    }));
  }, [chartSeries]);

  // ====================================================
  //  SILENT REFRESH DATA HANDLER
  // ====================================================
  const fetchdevidata = useCallback(
    async (isSilent = false) => {
      if (!device?._id || !sensor) return;
      if (!isSilent) setLoading(true);

      try {
        const resp = await POST(API.DEVICE.LATEST_DATA, {
          deviceId: device._id,
          sensorName: sensor,
          deviceNumber: `${phasevalue - 1}`,
          startDate,
          endDate: startDate,
        });

        const data = Array.isArray(resp?.msg) ? resp.msg : [];
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`),
        );
        const nextLabels = sortedData.map((item) =>
          moment(`${item.date} ${item.time}`).format("HH:mm:ss"),
        );

        if (isSilent && graphData.length > 0) {
          setLabels(nextLabels);
          setGraphData(sortedData);
          ApexCharts.exec(
            "realtime-telemetry-chart",
            "updateSeries",
            chartSeries,
            true,
          );
        } else {
          setLabels(nextLabels);
          setGraphData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [device?._id, phasevalue, sensor, startDate, graphData.length, chartSeries],
  );

  useEffect(() => {
    fetchdevidata(false);
  }, [device?._id, phasevalue, sensor, startDate]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      fetchdevidata(true);
    }, 5000);
    return () => clearInterval(intervalId.current);
  }, [fetchdevidata, intervalId]);

  return (
    <>
      <div className="w-full flex flex-col my-8">
        {/* 1. GRAPH TOP BAR / HEADER CONTAINER */}
        <div className="bg-[#044a70] rounded-t-lg p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 sm:gap-6 text-white">
            <p className="text-sm font-medium">
              Device UID :{" "}
              <span className="font-bold">#{device?.nodeUid || "N/A"}</span>
            </p>
            <p className="text-sm font-medium">
              Device Name :{" "}
              <span className="font-bold">{device?.deviceName || "N/A"}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-start md:justify-end items-start sm:items-center gap-3 sm:gap-6 w-full md:w-auto">
            <p className="text-sm text-white flex items-center gap-2">
              Temperature :
              <span className="bg-[#f7f8fd] border-2 border-white rounded-md px-2 py-0.5 text-[#ef4444] font-bold text-xs">
                {getTempValue({ msg: device }).toFixed(2)} °C
              </span>
            </p>

            <p className="text-sm text-white flex items-center gap-2">
              Humidity :
              <span className="font-bold text-sm">
                {getHumValue({ msg: device }).toFixed(2)} %
              </span>
            </p>

            <div className="w-full sm:w-auto mt-1 sm:mt-0 inline-block">
              <DewnloadReport
                GraphDate={startDate}
                sensor={sensor}
                vmrSensors={phasevalue}
                device={device}
                DataSets={downloadDataSets}
              />
            </div>
          </div>
        </div>

        {/* 2. FILTER CONTROLS & LIVE STAT BADGES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 border-x border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <FormControl size="small" className="min-w-[180px]">
              <TextField
                select
                variant="outlined"
                value={sensor || ""}
                onChange={(e) => SensorTypeChange(e.target.value)}
                size="small"
                InputProps={{
                  className: "bg-white text-black text-sm rounded-md",
                }}
              >
                {Number(device?.resSensors || 0) > 0 && (
                  <MenuItem value="RES">Resistance</MenuItem>
                )}
                {Number(device?.vmrSensors || 0) > 0 && (
                  <MenuItem value="VMR">Phase Meter</MenuItem>
                )}
                {Number(device?.nerSensors || 0) > 0 && (
                  <MenuItem value="NER">GN</MenuItem>
                )}
                {Number(device?.spdSensors || 0) > 0 && (
                  <MenuItem value="SPD">SPD</MenuItem>
                )}
                {(Number(device?.temp || 0) > 0 ||
                  (device?.TempValues?.DATASTREAMS &&
                    device.TempValues.DATASTREAMS.length > 0)) && (
                  <MenuItem value="TEMP">Temperature</MenuItem>
                )}
                {(Number(device?.humidity || 0) > 0 ||
                  (device?.HumValues?.DATASTREAMS &&
                    device.HumValues.DATASTREAMS.length > 0)) && (
                  <MenuItem value="HUM">Humidity</MenuItem>
                )}
              </TextField>
            </FormControl>

            {sensor === "VMR" && Number(device?.vmrSensors || 0) > 0 && (
              <FormControl size="small" className="min-w-[120px]">
                <TextField
                  select
                  variant="outlined"
                  value={String(phasevalue || "1")}
                  onChange={(e) => PhaseValueChange(e.target.value)}
                  size="small"
                  InputProps={{
                    className: "bg-white text-black text-sm rounded-md",
                  }}
                >
                  {Array.from({ length: Number(device?.vmrSensors || 0) }).map(
                    (_, i) => (
                      <MenuItem key={i} value={String(i + 1)}>
                        PH{i + 1}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </FormControl>
            )}
          </div>

          <div className="w-full md:w-auto text-left md:text-right">
            {graphData && graphData.length > 0 ? (
              <div className="inline-block text-left bg-white p-2 px-3.5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  {/* Tailwind Pulse Dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Live: {graphData[graphData.length - 1]?.date}{" "}
                    {graphData[graphData.length - 1]?.time}
                  </span>
                </div>

                {/* Styled Border Pill Badges */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {chartSeries.map((series, index) => {
                    const lastValue = series.data
                      ? series.data[series.data.length - 1]
                      : null;
                    const parsedValue =
                      lastValue && typeof lastValue === "object"
                        ? lastValue.y
                        : lastValue;
                    const color =
                      BORDER_COLORS[index % BORDER_COLORS.length] || "#3b82f6";

                    return (
                      <div
                        key={index}
                        style={{
                          borderColor: color,
                          backgroundColor: `${color}0d`,
                        }}
                        className="border rounded px-2 py-0.5 flex items-center"
                      >
                        <span
                          style={{ color: color }}
                          className="text-xs font-bold"
                        >
                          {series.name}:{" "}
                          {parsedValue !== undefined &&
                          parsedValue !== null &&
                          !isNaN(Number(parsedValue))
                            ? Number(parsedValue).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Premium Minimalist Placeholder Card */
              <div className="w-full sm:min-w-[240px] min-h-[64px] flex flex-col justify-center items-center bg-gray-200/50 rounded-xl border border-dashed border-gray-200 p-3 transition-all duration-300">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gray-600"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono text-gray-800">
                    Standby
                  </span>
                </div>
                <p className="text-[10px] text-gray-700/90 font-medium mt-0.5">
                  Waiting for incoming hardware packets...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. CHART SURFACE PANEL */}
        <div className="relative min-h-[320px] rounded-b-lg overflow-hidden bg-white border border-gray-200 p-2.5">
          {chartSeries.length > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={320}
            />
          ) : !loading ? (
            <div className="min-h-[320px] flex items-center justify-center">
              <img src={hondaGif} alt="No graph data available" />
            </div>
          ) : null}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-50/55 to-slate-50/80 backdrop-blur-[3px] z-10">
              <CircularProgress
                size={34}
                thickness={4.5}
                className="text-[#044a70]"
              />
              <span className="text-sm font-semibold tracking-wide text-[#044a70]">
                Loading graph data...
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
