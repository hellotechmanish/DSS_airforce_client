import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import axios from "axios";
import DewnloadReport from "../../../DownloadReport/Downlaod";
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
import dayjs from "dayjs";
import { AuthContext } from "../../../../../context/AuthContext";
import hondaGif from "../../../../../assets/img/hondagif.gif";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";

let interval;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
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

export default function Graph({
  device,
  sensor,
  SensorTypeChange,
  intervalId,
  value,
}) {
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
  const auth = React.useContext(AuthContext);
  const currentDate = dayjs().toDate();

  const [dateType, setDateType] = useState(0);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );

  const handleData = (data, datatype) => {
    if (datatype == "startDate") {
      setStartDate(moment(data).format("YYYY-MM-DD"));
    }
  };
  const [phasevalue, setPhaseValue] = useState(1);
  const PhaseValueChange = (newValue) => {
    setPhaseValue(newValue);
  };

  // ==================================================== //
  const [labels, setLabels] = React.useState([]);
  const [graphData, setGraphData] = React.useState([]);
  const [DataSets, setDataSets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [borderColorArray] = React.useState([
    "rgb(255, 99, 132)",
    "rgb(230, 230, 0)",
    "rgb(51, 204, 255)",
    "rgb(204, 51, 255)",
    "rgb(60, 179, 113)",
    "rgb(238, 130, 238)",
    "rgb(255, 165, 0)",
    "rgb(106, 90, 20)",
    "rgb(255, 99, 71)",
  ]);
  const [backgroundColorArray] = React.useState([
    "rgba(255, 99, 132, 0.5)",
    "rgba(230, 230, 0, 0.5)",
    "rgba(51, 204, 255, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(60, 179, 113, 0.5)",
    "rgba(238, 130, 238, 0.5)",
    "rgba(255, 165, 0, 0.5)",
    "rgba(106, 90, 205, 0.5)",
    "rgba(255, 99, 71, 0.5)",
  ]);

  const [ItemPhase] = React.useState(["R", "Y", "B", "RY", "YB", "RB"]);

  const [userDevice, setUserDevice] = React.useState([]);

  React.useEffect(() => {
    if (graphData.length > 0) {
      if (sensor === "RES") {
        let arr = [];

        if (auth.user.role === 2) {
          for (let i = 0; i < userDevice?.resistanceNumber?.length; i++) {
            let obj = {};
            obj["label"] = `R${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        } else {
          for (let i = 0; i < new Array(device?.resSensors).length; i++) {
            let obj = {};
            obj["label"] = `R${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        }
        setDataSets(arr);
      }

      if (sensor === "SPD") {
        let arr = [];

        if (auth.user.role === 2) {
          for (let i = 0; i < userDevice?.spdNumber?.length; i++) {
            let obj = {};
            obj["label"] = `SPD${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        } else {
          for (let i = 0; i < new Array(device?.spdSensors).length; i++) {
            let obj = {};
            obj["label"] = `SPD${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        }
        setDataSets(arr);
      }

      if (sensor === "NER") {
        let arr = [];
        if (auth.user.role === 2) {
          for (let i = 0; i < userDevice?.gnNumber?.length; i++) {
            let obj = {};
            obj["label"] = `GN${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        } else {
          for (let i = 0; i < new Array(device?.nerSensors).length; i++) {
            let obj = {};
            obj["label"] = `GN${i + 1}`;
            obj["data"] = graphData?.map(
              (item) => item.msg.DATASTREAMS[i]?.value,
            );
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        }
        setDataSets(arr);
      }

      if (sensor === "VMR") {
        let arr = [];
        if (auth.user.role === 2) {
          for (let i = 0; i < userDevice?.phaseNumber?.length; i++) {
            let obj = {};
            obj["label"] = ItemPhase[i];
            obj["data"] = graphData
              ?.filter((item) => {
                return item?.phaseNumber === ItemPhase[i]?.toLowerCase();
              })
              .map((item) => item.value);
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        } else {
          for (let i = 0; i < ItemPhase?.length; i++) {
            let obj = {};
            obj["label"] = ItemPhase[i];
            obj["data"] = graphData
              ?.filter((item) => {
                return item?.phaseNumber === ItemPhase[i]?.toLowerCase();
              })
              .map((item) => item.value);
            obj["borderColor"] = borderColorArray[i];
            obj["backgroundColor"] = backgroundColorArray[i];
            arr.push(obj);
          }
        }
        setDataSets(arr);
      }
      if (sensor === "TEMP") {
        let arr = [];
        let obj = {};
        obj["label"] = `T${1}`;
        //obj["data"] = graphData?.map((item) => item.msg.DATASTREAMS[0]?.value);
        obj["data"] = graphData.map((item) => getTempValue(item));
        obj["borderColor"] = borderColorArray[0];
        obj["backgroundColor"] = backgroundColorArray[0];
        arr.push(obj);
        setDataSets(arr);
      }
      if (sensor === "HUM") {
        let arr = [];
        let obj = {};
        obj["label"] = `H${1}`;
        obj["data"] = graphData.map((item) => getHumValue(item));
        obj["borderColor"] = borderColorArray[0];
        obj["backgroundColor"] = backgroundColorArray[0];
        arr.push(obj);
        setDataSets(arr);
      }
    } else {
      // console.log("graphData length is 0");
    }
  }, [graphData]);

  React.useEffect(() => {
    let user = auth.user.deviceSensors.find(
      (item) => item.deviceId === device._id,
    );
    setUserDevice(user);
  }, [auth]);

  // function get Graph data
  async function getData() {
    if (!device) return;

    setLoading(true);

    try {
      const res = await POST(API.DEVICE.LATEST_DATA, {
        deviceId: device._id,
        sensorName: sensor,
        deviceNumber: `${phasevalue - 1}`,
        startDate,
        endDate: startDate,
      });

      // res already = response.data (interceptor ke baad)
      setLabels([...new Set(res.msg.map((item) => item.time))]);
      setGraphData(res.msg);
    } catch (error) {
      console.error("Error fetching graph data", error);
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    getData();
  }, [sensor, startDate, value > 0, phasevalue]);

  React.useEffect(() => {
    intervalId.current = setInterval(() => {
      getData();
    }, 11000);
    return () => {
      clearInterval(intervalId.current);
    };
  }, [sensor, startDate, value, phasevalue]);

  React.useEffect(() => {
    if (dateType === 0) {
      setStartDate(moment(new Date()).format("YYYY-MM-DD"));
    }
  }, [dateType]);

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
            <FormControl
              className="MainPageFormControl mt10px grey-border "
              size="small"
            >
              {auth?.user?.role === 0 || auth?.user?.role === 1 ? (
                <TextField
                  select
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  className="Selectdropstyle"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  defaultValue={"RES"}
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={(e) => {
                    SensorTypeChange(e.target.value);
                  }}
                >
                  <MenuItem value={"RES"} className="Selectmenustyle">
                    Resistance
                  </MenuItem>
                  <MenuItem value={"VMR"} className="Selectmenustyle">
                    Phase Meter
                  </MenuItem>
                  <MenuItem value={"NER"} className="Selectmenustyle">
                    GN
                  </MenuItem>
                  <MenuItem value={"SPD"} className="Selectmenustyle">
                    SPD
                  </MenuItem>{" "}
                  <MenuItem value={"TEMP"} className="Selectmenustyle">
                    Temperature
                  </MenuItem>
                  <MenuItem value={"HUM"} className="Selectmenustyle">
                    Humidity
                  </MenuItem>
                </TextField>
              ) : (
                <TextField
                  select
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  className="Selectdropstyle"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  defaultValue={"RES"}
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={(e) => {
                    SensorTypeChange(e.target.value);
                  }}
                >
                  {userDevice?.resistanceNumber?.length > 0 ? (
                    <MenuItem value={"RES"} className="Selectmenustyle">
                      Resistance
                    </MenuItem>
                  ) : null}
                  {userDevice?.phaseNumber?.length > 0 ? (
                    <MenuItem value={"VMR"} className="Selectmenustyle">
                      Phase Meter
                    </MenuItem>
                  ) : null}
                  {userDevice?.gnNumber?.length > 0 ? (
                    <MenuItem value={"NER"} className="Selectmenustyle">
                      GN
                    </MenuItem>
                  ) : null}
                  {userDevice?.spdNumber?.length > 0 ? (
                    <MenuItem value={"SPD"} className="Selectmenustyle">
                      SPD
                    </MenuItem>
                  ) : null}
                  {userDevice?.temp?.length > 0 ? (
                    <MenuItem value={"TEMP"} className="Selectmenustyle">
                      Temperature
                    </MenuItem>
                  ) : null}
                  {userDevice?.humidity?.length > 0 ? (
                    <MenuItem value={"HUM"} className="Selectmenustyle">
                      Humidity
                    </MenuItem>
                  ) : null}
                </TextField>
              )}
            </FormControl>{" "}
          </Grid>
          <Grid item md={3}>
            {sensor === "VMR" && (
              <FormControl size="small">
                <TextField
                  select
                  variant="outlined"
                  defaultValue="1"
                  onChange={(e) => PhaseValueChange(Number(e.target.value))}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    minWidth: 120,
                    "& .MuiSelect-select": {
                      color: "#000",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "#fff",
                        "& .MuiMenuItem-root": {
                          color: "#000",
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
