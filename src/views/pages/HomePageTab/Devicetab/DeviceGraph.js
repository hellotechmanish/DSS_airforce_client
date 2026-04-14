import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import { Line } from "react-chartjs-2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import DewnloadReport from "../../DownloadReport/Downlaod";
import hondaGif from "../../../../assets/img/hondagif.gif";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../../../../context/AuthContext";
import { POST } from "../../../../lib/request";
import { API } from "../../../../lib/endpoint";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
};

const BORDER_COLORS = [
  "rgb(255, 99, 132)",
  "rgb(230, 230, 0)",
  "rgb(51, 204, 255)",
  "rgb(204, 51, 255)",
  "rgb(60, 179, 113)",
  "rgb(238, 130, 238)",
  "rgb(255, 165, 0)",
  "rgb(106, 90, 20)",
  "rgb(255, 99, 71)",
];

const BG_COLORS = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(230, 230, 0, 0.5)",
  "rgba(51, 204, 255, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(60, 179, 113, 0.5)",
  "rgba(238, 130, 238, 0.5)",
  "rgba(255, 165, 0, 0.5)",
  "rgba(106, 90, 205, 0.5)",
  "rgba(255, 99, 71, 0.5)",
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
  const auth = React.useContext(AuthContext);
  const currentDate = dayjs().toDate();

  //("AuthContext auth data ==>", auth.user);

  // const intervalId = React.useRef(sensor);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );

  const handleData = (data, datatype) => {
    if (datatype === "startDate") {
      setStartDate(moment(data).format("YYYY-MM-DD"));
    }
  };
  const [phasevalue, setPhaseValue] = useState(1);
  const PhaseValueChange = (newValue) => {
    // //("MENU ITEM NEW VALUE =>", newValue);
    setPhaseValue(Number(newValue));
  };

  // ==================================================== //
  const [labels, setLabels] = React.useState([]);
  const [graphData, setGraphData] = React.useState([]);
  const [DataSets, setDataSets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [userDevice, setUserDevice] = React.useState([]);
  // const [data, setData] = React.useState({})

  // let data = {
  //   labels,
  //   datasets: DataSets,
  // };
  // ["rgb(255, 99, 132)", ]
  // []

  useEffect(() => {
    const ds = auth?.user?.deviceSensors;

    if (!Array.isArray(ds) || !device?._id) {
      setUserDevice(null);
      return;
    }

    const found = ds.find(
      (item) => item?.sensorId?.toString() === device._id?.toString(),
    );

    console.log("Matched userDevice =>", found); //  debug

    setUserDevice(found || null);
  }, [auth, device?._id]);

  const computedDataSets = useMemo(() => {
    if (!Array.isArray(graphData) || graphData.length === 0) return [];

    const role = auth?.user?.role;

    //  RES (Resistance)
    if (sensor === "RES") {
      const count =
        role === "user"
          ? userDevice?.resistanceNumber?.length ||
            Number(device?.resSensors || 0)
          : Number(device?.resSensors || 0);

      return Array.from({ length: count }, (_, i) => ({
        label: `R${i + 1}`,

        //  safe value + no undefined
        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),

        borderColor: BORDER_COLORS[i],
        backgroundColor: BG_COLORS[i],

        spanGaps: true, //  no line break
        tension: 0.1, //  smooth curve
      }));
    }

    //  SPD
    if (sensor === "SPD") {
      const count =
        role === "user"
          ? userDevice?.spdNumber?.length || 0
          : Number(device?.spdSensors || 0);

      return Array.from({ length: count }, (_, i) => ({
        label: `SPD${i + 1}`,

        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),

        borderColor: BORDER_COLORS[i],
        backgroundColor: BG_COLORS[i],

        spanGaps: true, //  fix break
        tension: 0.1,
      }));
    }

    //  NER (GN)
    if (sensor === "NER") {
      const count =
        role === "user"
          ? userDevice?.gnNumber?.length || Number(device?.nerSensors || 0)
          : Number(device?.nerSensors || 0);

      return Array.from({ length: count }, (_, i) => ({
        label: `GN${i + 1}`,

        data: graphData.map((item) => {
          const val = item?.msg?.DATASTREAMS?.[i]?.value;
          return val !== undefined && val !== null ? Number(val) : 0;
        }),

        borderColor: BORDER_COLORS[i],
        backgroundColor: BG_COLORS[i],

        spanGaps: true, //  fix break
        tension: 0.1,
      }));
    }

    //  VMR (Phase)
    if (sensor === "VMR") {
      const phaseList =
        role === "user" && Array.isArray(userDevice?.phaseNumber)
          ? PHASE_LABELS.slice(0, userDevice.phaseNumber.length)
          : PHASE_LABELS;

      return phaseList.map((phase, i) => ({
        label: phase,

        data: graphData
          .filter((item) => item?.phaseNumber === phase.toLowerCase())
          .map((item) => {
            const val = item?.value;
            return val !== undefined && val !== null ? Number(val) : 0;
          }),

        borderColor: BORDER_COLORS[i],
        backgroundColor: BG_COLORS[i],

        spanGaps: true,
        tension: 0.1,
      }));
    }

    //  TEMP
    if (sensor === "TEMP") {
      return [
        {
          label: "T1",

          data: graphData.map((item) => {
            const val = getTempValue(item);
            return val !== undefined && val !== null ? Number(val) : 0;
          }),

          borderColor: BORDER_COLORS[0],
          backgroundColor: BG_COLORS[0],

          spanGaps: true,
          tension: 0.1,
        },
      ];
    }

    //  HUM
    if (sensor === "HUM") {
      return [
        {
          label: "H1",

          data: graphData.map((item) => {
            const val = getHumValue(item);
            return val !== undefined && val !== null ? Number(val) : 0;
          }),

          borderColor: BORDER_COLORS[0],
          backgroundColor: BG_COLORS[0],

          spanGaps: true,
          tension: 0.1,
        },
      ];
    }

    return [];
  }, [auth?.user?.role, device, graphData, sensor, userDevice]);
  useEffect(() => {
    setDataSets(computedDataSets);
  }, [computedDataSets]);

  // const fetchdevidata = useCallback(async () => {
  //   try {
  //     if (!device?._id) return;
  //     const resp = await POST(API.DEVICE.LATEST_DATA, {
  //       deviceId: device._id,
  //       sensorName: sensor,
  //       deviceNumber: `${phasevalue - 1}`,
  //       startDate,
  //       endDate: startDate,
  //     });

  //     console.log("Graph API resp =>", resp);

  //     const data = resp?.msg || [];

  //     setLabels([...new Set(data.map((item) => item.time))]);
  //     setGraphData(data);
  //   } catch (error) {
  //     console.error("Error fetching graph data:", error);
  //   }
  // }, [device?._id, phasevalue, sensor, startDate]);

  const fetchdevidata = useCallback(async () => {
    if (!device?._id) return;

    setLoading(true);

    try {
      const resp = await POST(API.DEVICE.LATEST_DATA, {
        deviceId: device._id,
        sensorName: sensor,
        deviceNumber: `${phasevalue - 1}`,
        startDate,
        endDate: startDate,
      });

      const data = Array.isArray(resp?.msg) ? resp.msg : [];

      // console.log("Parsed Graph Data : ", data);

      //  STEP 1: SORT DATA (MOST IMPORTANT)
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`),
      );

      //  STEP 2: LABELS FIX (NO RANDOM ORDER)
      const labels = sortedData.map((item) =>
        moment(`${item.date} ${item.time}`).format("HH:mm:ss"),
      );

      // console.log("labels>>>", labels);

      //  STEP 3: SET STATE
      setLabels(labels);
      setGraphData(sortedData);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
    }
  }, [device?._id, phasevalue, sensor, startDate]);
  useEffect(() => {
    fetchdevidata();
  }, [fetchdevidata]);

  // let interval = setInterval(() => {
  //   setStartDate(startDate);
  //   setEndDate(endDate);
  //   getData();
  // }, 50000);
  useEffect(() => {
    intervalId.current = setInterval(() => {
      // console.log("Hit Graph Data render");
      fetchdevidata();
    }, 11000);
    return () => {
      clearInterval(intervalId.current);
    };
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
                  className="width100  white-typo ml-12"
                >
                  Device UID :{" "}
                  <span className="white-typo"> #{device?.nodeUid} </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography className="white-typo">
                  Device Name :
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
                  {getHumValue({ msg: device }).toFixed(2)} %
                </span>
              </Typography>
              <DewnloadReport
                GraphDate={startDate}
                sensor={sensor}
                vmrSensors={phasevalue}
                device={device}
                DataSets={DataSets}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className="mt-16  width100  "
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
                  "& .MuiSelect-select": {
                    color: "#000",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#fff",
                        "& .MuiMenuItem-root": {
                          color: "#000",
                        },
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
                    "& .MuiSelect-select": {
                      color: "#000",
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#fff",
                          "& .MuiMenuItem-root": {
                            color: "#000",
                          },
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

          <Grid item md={5} justifyContent="flex-end" alignItems="flex-end">
            <Typography align="right" className="mr-10 ">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  className="rangepicker width-150"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  // disabled={!dateType ? true: false}
                  inputFormat="dd/MM/yyyy"
                  value={startDate}
                  maxDate={currentDate}
                  onChange={(e) => {
                    handleData(e, "startDate");
                  }}
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
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                position: "relative",
                minHeight: 320,
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                transition: "background-color 0.25s ease",
              }}
            >
              {DataSets && DataSets?.length > 0 ? (
                <Line
                  options={options}
                  data={{
                    labels,
                    datasets: DataSets,
                  }}
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
                    transition: "opacity 0.25s ease",
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
