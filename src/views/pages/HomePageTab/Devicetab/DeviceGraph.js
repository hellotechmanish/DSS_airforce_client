"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
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
  const currentDate = dayjs().toDate();

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [phasevalue, setPhaseValue] = useState(1);
  const [labels, setLabels] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDevice, setUserDevice] = useState([]);

  const handleData = (data, datatype) => {
    if (datatype === "startDate")
      setStartDate(moment(data).format("YYYY-MM-DD"));
  };

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

  // ====================================================
  // 📊 1. DATASETS SERIES GENERATION ENGINE (Shifted Up)
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
  // ⚡ 2. APEXCHARTS CONFIGURATION (Safe Placement)
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
          formatter: (val) => val.toFixed(2),
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
  // 🔄 SILENT REFRESH DATA HANDLER
  // ====================================================
  const fetchdevidata = useCallback(
    async (isSilent = false) => {
      if (!device?._id) return;
      if (!isSilent) setLoading(true);

      try {
        const resp = await POST(API.DEVICE.LATEST_DATA, {
          deviceId: device._id,
          sensorName: sensor,
          deviceNumber: `${phasevalue - 1}`,
          startDate,
          endDate: startDate,
        });

        console.log(resp.msg);

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
      <Grid container className="graph-container mt-32 mb-40">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="grapgh-head"
        >
          <Grid item md={6}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography
                  align="center"
                  className="width100 white-typo ml-12"
                >
                  Device UID :{" "}
                  <span className="white-typo"> #{device?.nodeUid} </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography className="white-typo">
                  Device Name :{" "}
                  <span className="white-typo"> {device?.deviceName} </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Grid container justifyContent="space-between">
              <Typography></Typography>
              <Typography className="white-typo mt-8">
                Temperature :{" "}
                <span
                  className="red-typo"
                  style={{
                    backgroundColor: "#f7f8fd",
                    border: "2px solid #ffffff",
                    borderRadius: "6px",
                    padding: "1px",
                  }}
                >
                  {getTempValue({ msg: device }).toFixed(2)} °C
                </span>
              </Typography>
              <Typography className="white-typo mt-8 ">
                Humidity :{" "}
                <span className="white-typo">
                  {" "}
                  {getHumValue({ msg: device }).toFixed(2)} %{" "}
                </span>
              </Typography>
              <DewnloadReport
                GraphDate={startDate}
                sensor={sensor}
                vmrSensors={phasevalue}
                device={device}
                DataSets={downloadDataSets}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className="mt-16 width100"
        >
          <Grid item md={2} sx={{ marginLeft: "10px" }}>
            <FormControl size="small">
              <TextField
                select
                variant="outlined"
                defaultValue="RES"
                onChange={(e) => SensorTypeChange(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  minWidth: 180,
                  "& .MuiSelect-select": { color: "#000" },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#fff",
                        "& .MuiMenuItem-root": { color: "#000" },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="RES">Resistance</MenuItem>
                <MenuItem value="VMR">Phase Meter</MenuItem>
                <MenuItem value="NER">GN</MenuItem>
                <MenuItem value="SPD">SPD</MenuItem>
                <MenuItem value="TEMP">Temperature</MenuItem>
                <MenuItem value="HUM">Humidity</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item md={3}>
            {sensor === "VMR" && (
              <FormControl size="small">
                <TextField
                  select
                  variant="outlined"
                  defaultValue="1"
                  onChange={(e) => PhaseValueChange(e.target.value)}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    minWidth: 120,
                    "& .MuiSelect-select": { color: "#000" },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#fff",
                          "& .MuiMenuItem-root": { color: "#000" },
                        },
                      },
                    },
                  }}
                >
                  {Array.from({ length: Number(device?.vmrSensor || 0) }).map(
                    (_, i) => (
                      <MenuItem key={i} value={String(i + 1)}>
                        PH{i + 1}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </FormControl>
            )}
          </Grid>

          <Grid
            item
            md={5}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Box sx={{ width: "100%", textAlign: "right" }} className="mr-10">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  className="rangepicker width-150"
                  InputProps={{ disableUnderline: true }}
                  inputFormat="dd/MM/yyyy"
                  value={startDate}
                  maxDate={currentDate}
                  onChange={(e) => handleData(e, "startDate")}
                  renderInput={(params) => (
                    <TextField
                      variant="filled"
                      className="width-100 rangepicker"
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "Start date",
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                position: "relative",
                minHeight: 320,
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                backgroundColor: "#fff",
                padding: "10px",
              }}
            >
              {chartSeries.length > 0 ? (
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height={320}
                />
              ) : !loading ? (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ minHeight: 320 }}
                >
                  <img src={hondaGif} alt="No graph data available" />
                </Grid>
              ) : null}

              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    background:
                      "linear-gradient(180deg, rgba(247, 248, 253, 0.55) 0%, rgba(247, 248, 253, 0.82) 100%)",
                    backdropFilter: "blur(3px)",
                    zIndex: 2,
                  }}
                >
                  <CircularProgress
                    size={34}
                    thickness={4.5}
                    sx={{ color: "#044a70" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#044a70",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Loading graph data...
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
