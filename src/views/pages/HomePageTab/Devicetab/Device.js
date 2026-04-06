// Import Server Component
import React, { Suspense, lazy, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Grid } from "@mui/material";

// Import Custom Component
import Viewprofile from "../viewprofielDiialog";
import { API } from "../../../../lib/endpoint";
import { GET } from "../../../../lib/request";

const DeviceGraph = lazy(() => import("./DeviceGraph"));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function App({ deviceID, value1, setValue1, value }) {
  const [deviceID2, setDeviceID2] = useState(null);
  const [sensor, setSensor] = useState("RES");
  const [sensorValue, setSensorValue] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const intervalId = React.useRef(sensor);

  const getDeviceById = async (deviceID) => {
    if (!deviceID) {
      console.warn("Skipped API call, invalid deviceID:", deviceID);
      return;
    }
    try {
      const res = await GET(API.DEVICE.GET_BY_ID(deviceID));

      if (!res || res.msg === "deviceID not found") {
        console.warn("Device not found:", deviceID);
        setSensorValue({});
        return;
      }

      setSensorValue(res?.msg || {});
    } catch (error) {
      console.error("API call failed:", error);
      setSensorValue({});
    }
  };

  const handleChange2 = (event, newValue) => {
    setValue1(newValue);

    const selectedId = deviceID[newValue]?._id;

    if (!selectedId) {
      console.warn("Invalid selection:", newValue);
      return;
    }

    setDeviceID2(selectedId);
    getDeviceById(selectedId); // optional (can rely on useEffect)
    setSensor("RES");
  };

  useEffect(() => {
    if (deviceID?.length > 0) {
      setDeviceID2(deviceID[0]._id);
    }
  }, [deviceID]);

  useEffect(() => {
    if (deviceID2) {
      getDeviceById(deviceID2);
    }
  }, [deviceID2]);

  useEffect(() => {
    setShowGraph(false);

    if (!sensorValue?._id || deviceID2 !== sensorValue._id) {
      return undefined;
    }

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShowGraph(true), {
        timeout: 1500,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => {
      setShowGraph(true);
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [deviceID2, sensorValue]);

  useEffect(() => {
    if (!deviceID2) return;

    const interval = setInterval(() => {
      getDeviceById(deviceID2);
    }, 10000);

    return () => clearInterval(interval);
  }, [deviceID2]);

  const SensorTypeChange = (newValue) => {
    setSensor(newValue);
  };

  return (
    <>
      <Grid container className="widthLR-90 ">
        {/* show device name and view profile button in device tab */}

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            {" "}
            {/*  full width */}
            <Tabs
              value={value1}
              onChange={handleChange2}
              className="Tabs-dashboard2"
              variant="scrollable" //  always scrollable
              scrollButtons="auto" //  left/right buttons auto
              allowScrollButtonsMobile //  mobile pe bhi arrows
              aria-label="scrollable auto tabs example"
              sx={{
                width: "100%", //  full parent width
                minHeight: "48px",
                "& .MuiTabs-flexContainer": {
                  alignItems: "center",
                },
              }}
            >
              {deviceID?.length > 0 ? (
                deviceID?.map((item, index) => {
                  return (
                    <Tab
                      key={index}
                      style={{ minWidth: 100 }} //  thoda proper width
                      className="Tab-dashboardlabel2 fs-16 mr-20 hover"
                      {...a11yProps(index)}
                      label={
                        <span className="text-sm font-semibold text-gray-800 tracking-wide">
                          {item?.deviceName}
                        </span>
                      }
                    />
                  );
                })
              ) : (
                <Tab
                  className="Tab-dashboardlabel2 fs-16 mr-20 hover"
                  label={<Typography>No Device Assign</Typography>}
                />
              )}
            </Tabs>
          </Grid>
        </Grid>

        {/* chat pi line  */}

        <Grid container className="mt-16">
          {value1 === 0 ? (
            <TabPanel value={value1} index={0} className="width100">
              <Typography align="right"></Typography>
              <Grid container className=" mt-24 border-grey">
                <Grid item md={1.5}>
                  <Typography
                    align="center"
                    className="width100 table-head table-head fw-500"
                  >
                    DEVICE NAME
                  </Typography>
                  <Typography className="table-freecell"> </Typography>

                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    sx={{
                      borderRight: "1px solid #dddddd",
                      paddingBottom: "20px",
                    }}
                  >
                    <Grid item className="width100">
                      <Typography
                        align="center"
                        className="width100  heading-black  "
                      >
                        {sensorValue?.deviceName}
                      </Typography>
                      <Typography
                        align="center"
                        className="width100 blue-typo cursor "
                      >
                        <Viewprofile
                          sensorValue={sensorValue}
                          deviceID2={deviceID2}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {sensorValue?.resSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.3
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.5
                            : 0 ||
                                (sensorValue?.spdSensors &&
                                  sensorValue?.resSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.7
                              : 0 ||
                                  (sensorValue?.nerSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.spdSensors &&
                                      sensorValue?.resSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.resSensors)
                                    ? 1.5
                                    : 0 || sensorValue?.resSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100  table-head  bt  bb fw-500"
                    >
                      RESISTANCE
                    </Typography>
                    <Typography
                      className="table-freecell"
                      sx={{ borderLeft: "2px solid #dddddd" }}
                    ></Typography>
                    <Grid item xs={12}>
                      <div style={{ textAlign: "center" }}>
                        {sensorValue?.ResValues?.DATASTREAMS?.map(
                          (item, index) => {
                            return (
                              <Typography
                                key={index}
                                align="center"
                                style={{ display: "block" }}
                                className={
                                  sensorValue.resSensorsThreshold <
                                  Object.values(item)[1]
                                    ? "width100 table-cell table-cellbg fw-500 fs-14"
                                    : "width100 table-cell fw-500 fs-14"
                                }
                              >
                                R{index + 1} :
                                <span> {Object.values(item)[1]} Ω</span>
                              </Typography>
                            );
                          },
                        )}
                      </div>
                    </Grid>
                  </Grid>
                ) : null}
                {sensorValue?.nerSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.3
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.5
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.5
                              : 0 ||
                                  (sensorValue?.nerSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.nerSensors &&
                                      sensorValue?.spdSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.nerSensors &&
                                        sensorValue?.vmrSensors)
                                    ? 1.5
                                    : 0 || sensorValue?.nerSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100 table-head  fw-500"
                    >
                      GN
                    </Typography>
                    <Typography
                      className="table-freecell"
                      sx={{ borderLeft: "2px solid #dddddd" }}
                    ></Typography>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {sensorValue?.NerValues?.DATASTREAMS?.map(
                        (item, index) => {
                          return (
                            <Typography
                              key={index}
                              align="center"
                              className={
                                sensorValue.nerSensorsThreshold <
                                Object.values(item)[1]
                                  ? "width100 table-cell table-cellbg fw-500 fs-14"
                                  : "width100 table-cell fw-500 fs-14"
                              }
                            >
                              GN{index + 1} :
                              <span className="fw-500">
                                {" "}
                                {Object.values(item)[1]} V
                              </span>
                            </Typography>
                          );
                        },
                      )}
                    </Grid>
                  </Grid>
                ) : null}

                {sensorValue?.vmrSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 6.4
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.3
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 7.5
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 7.5
                              : 0 ||
                                  (sensorValue?.spdSensors &&
                                    sensorValue?.resSensors &&
                                    sensorValue?.vmrSensors)
                                ? 7
                                : 0 ||
                                    (sensorValue?.vmrSensors &&
                                      sensorValue?.resSensors)
                                  ? 9
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.spdSensors)
                                    ? 8
                                    : 0 ||
                                        (sensorValue?.vmrSensors &&
                                          sensorValue?.nerSensors)
                                      ? 9
                                      : 0 || sensorValue?.vmrSensors
                                        ? 10.5
                                        : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100 table-head table-head-child fw-500"
                    >
                      PHASE
                    </Typography>
                    <Grid container>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head  fw-600 table-head-child "
                        >
                          R
                        </Typography>

                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      className={
                                        sensorValue.vmrSensorsThreshold.r <
                                        item?.value[0]?.value
                                          ? "width100 table-cell table-cellbg fw-500 fs-14 "
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      R{index + 1}:
                                      <span className="width100    fw-500 fs-14">
                                        {item?.value[0]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          Y
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.y <
                                        item?.value[1]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      Y{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[1]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          B
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.b <
                                        item?.value[2]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      B{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[2]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head  fw-600 table-head-child "
                        >
                          RY
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.ry <
                                        item?.value[3]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      RY{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[3]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          YB
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.yb <
                                        item?.value[4]?.value
                                          ? "width100 table-cell table-cellbg fw-500 fs-14 "
                                          : "width100  table-cell fw-500 fs-14 "
                                      }
                                    >
                                      YB{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[4]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600  table-head-child"
                        >
                          RB
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.rb <
                                        item?.value[5]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      RB{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[5]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}

                {sensorValue?.spdSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.5
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.spdSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.8
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.5
                              : 0 ||
                                  (sensorValue?.spdSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.nerSensors &&
                                      sensorValue?.spdSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.spdSensors)
                                    ? 2.5
                                    : 0 || sensorValue?.spdSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography align="center" className=" table-head fw-500">
                      SPD
                    </Typography>{" "}
                    <Typography className="table-freecell"> </Typography>
                    <Grid item>
                      {sensorValue?.SpdValues?.DATASTREAMS?.map(
                        (item, index) => {
                          return (
                            <>
                              <Typography
                                align="center"
                                // className="width100 table-cell fw-500"
                                className={
                                  sensorValue?.spdSensorsThreshold < item.value
                                    ? "width100 table-cell table-cellbg fw-500  fs-14"
                                    : "width100  table-cell fw-500 fs-14"
                                }
                              >
                                SPD{index + 1} :
                                <span className="width100    fw-500">
                                  {item.value} KA
                                </span>
                              </Typography>
                            </>
                          );
                        },
                      )}
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
              {sensorValue &&
                sensor &&
                deviceID2 === sensorValue._id &&
                value1 === 0 && (
                  <DeviceGraph
                    device={sensorValue}
                    deviceID2={deviceID2}
                    sensor={sensor}
                    setSensor={setSensor}
                    SensorTypeChange={SensorTypeChange}
                    intervalId={intervalId}
                  />
                )}
            </TabPanel>
          ) : (
            <TabPanel value={value1} index={value1} className="width100">
              <Typography align="right"></Typography>
              <Grid container className=" mt-24 border-grey">
                <Grid item md={1.5}>
                  <Typography
                    align="center"
                    className="width100 table-head table-head fw-500"
                  >
                    DEVICE NAME
                  </Typography>
                  <Typography className="table-freecell"> </Typography>

                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    sx={{
                      borderRight: "1px solid #dddddd",
                      paddingBottom: "20px",
                    }}
                  >
                    <Grid item className="width100">
                      <Typography
                        align="center"
                        className="width100  heading-black  "
                      >
                        {sensorValue?.deviceName}
                      </Typography>
                      <Typography
                        align="center"
                        className="width100 blue-typo cursor "
                      >
                        <Viewprofile sensorValue={sensorValue} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {sensorValue?.resSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.3
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.5
                            : 0 ||
                                (sensorValue?.spdSensors &&
                                  sensorValue?.resSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.7
                              : 0 ||
                                  (sensorValue?.nerSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.spdSensors &&
                                      sensorValue?.resSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.resSensors)
                                    ? 1.5
                                    : 0 || sensorValue?.resSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100  table-head  bt  bb fw-500"
                    >
                      RESISTANCE
                    </Typography>
                    <Typography
                      className="table-freecell"
                      sx={{ borderLeft: "2px solid #dddddd" }}
                    ></Typography>
                    <Grid item>
                      {sensorValue?.ResValues?.DATASTREAMS?.map(
                        (item, index) => {
                          return (
                            <>
                              <Typography
                                align="center"
                                className={
                                  sensorValue.resSensorsThreshold <
                                  Object.values(item)[1]
                                    ? "width100 table-cell table-cellbg fw-500 fs-14 "
                                    : "width100  table-cell fw-500 fs-14 "
                                }
                              >
                                R{index + 1} :
                                <span>{Object.values(item)[1]} Ω</span>
                              </Typography>
                            </>
                          );
                        },
                      )}
                    </Grid>
                  </Grid>
                ) : null}
                {sensorValue?.nerSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.3
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.5
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.5
                              : 0 ||
                                  (sensorValue?.nerSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.nerSensors &&
                                      sensorValue?.spdSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.nerSensors &&
                                        sensorValue?.vmrSensors)
                                    ? 1.5
                                    : 0 || sensorValue?.nerSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100 table-head  fw-500"
                    >
                      GN
                    </Typography>
                    <Typography
                      className="table-freecell"
                      sx={{ borderLeft: "2px solid #dddddd" }}
                    ></Typography>
                    <Grid item>
                      {sensorValue?.NerValues?.DATASTREAMS?.map(
                        (item, index) => {
                          return (
                            <>
                              <Typography
                                align="center"
                                // className="width100 table-cell fw-500"
                                className={
                                  sensorValue.nerSensorsThreshold <
                                  Object.values(item)[1]
                                    ? "width100 table-cell table-cellbg fw-500  fs-14"
                                    : "width100  table-cell fw-500  fs-14"
                                }
                              >
                                GN{index + 1} :
                                <span className="width100    fw-500">
                                  {Object.values(item)[1]} V
                                </span>
                              </Typography>
                            </>
                          );
                        },
                      )}
                    </Grid>
                  </Grid>
                ) : null}

                {sensorValue?.vmrSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 6.4
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.3
                          : 0 ||
                              (sensorValue?.nerSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 7.5
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 7.5
                              : 0 ||
                                  (sensorValue?.spdSensors &&
                                    sensorValue?.resSensors &&
                                    sensorValue?.vmrSensors)
                                ? 7
                                : 0 ||
                                    (sensorValue?.vmrSensors &&
                                      sensorValue?.resSensors)
                                  ? 9
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.spdSensors)
                                    ? 8
                                    : 0 ||
                                        (sensorValue?.vmrSensors &&
                                          sensorValue?.nerSensors)
                                      ? 9
                                      : 0 || sensorValue?.vmrSensors
                                        ? 10.5
                                        : 0
                    }
                  >
                    <Typography
                      align="center"
                      className="width100 table-head table-head-child fw-500"
                    >
                      PHASE
                    </Typography>
                    <Grid container>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head  fw-600 table-head-child "
                        >
                          R
                        </Typography>

                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.r <
                                        item?.value[0]?.value
                                          ? "width100 table-cell table-cellbg fw-500 fs-14 "
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      R{index + 1}:
                                      <span className="width100    fw-500 fs-14">
                                        {item?.value[0]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          Y
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.y <
                                        item?.value[1]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      Y{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[1]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          B
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.b <
                                        item?.value[2]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      B{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[2]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head  fw-600 table-head-child "
                        >
                          RY
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.ry <
                                        item?.value[3]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      RY{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[3]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600 table-head-child"
                        >
                          YB
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.yb <
                                        item?.value[4]?.value
                                          ? "width100 table-cell table-cellbg fw-500 fs-14 "
                                          : "width100  table-cell fw-500 fs-14 "
                                      }
                                    >
                                      YB{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[4]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                      <Grid item md={2}>
                        <Typography
                          align="center"
                          className="table-head fw-600  table-head-child"
                        >
                          RB
                        </Typography>{" "}
                        <Grid item>
                          {sensorValue?.VmrValues?.DATASTREAMS?.map(
                            (item, index) => {
                              // //("Check data Data", item.value[0]);
                              return (
                                <>
                                  <Grid item>
                                    <Typography
                                      align="center"
                                      // className="width100 table-cell fw-500"
                                      className={
                                        sensorValue.vmrSensorsThreshold.rb <
                                        item?.value[5]?.value
                                          ? "width100 table-cell table-cellbg fw-500  fs-14"
                                          : "width100  table-cell fw-500  fs-14"
                                      }
                                    >
                                      RB{index + 1} :
                                      <span className="width100    fw-500">
                                        {item?.value[5]?.value} V
                                      </span>
                                    </Typography>
                                  </Grid>{" "}
                                </>
                              );
                            },
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}

                {sensorValue?.spdSensors ? (
                  <Grid
                    item
                    md={
                      sensorValue?.nerSensors &&
                      sensorValue?.resSensors &&
                      sensorValue?.spdSensors &&
                      sensorValue.vmrSensors
                        ? 1.5
                        : 0 ||
                            (sensorValue?.nerSensors &&
                              sensorValue?.resSensors &&
                              sensorValue?.spdSensors)
                          ? 3.5
                          : 0 ||
                              (sensorValue?.spdSensors &&
                                sensorValue?.resSensors &&
                                sensorValue?.vmrSensors)
                            ? 1.8
                            : 0 ||
                                (sensorValue?.nerSensors &&
                                  sensorValue?.spdSensors &&
                                  sensorValue?.vmrSensors)
                              ? 1.5
                              : 0 ||
                                  (sensorValue?.spdSensors &&
                                    sensorValue?.resSensors)
                                ? 5.25
                                : 0 ||
                                    (sensorValue?.nerSensors &&
                                      sensorValue?.spdSensors)
                                  ? 5.25
                                  : 0 ||
                                      (sensorValue?.vmrSensors &&
                                        sensorValue?.spdSensors)
                                    ? 2.5
                                    : 0 || sensorValue?.spdSensors
                                      ? 10.5
                                      : 0
                    }
                  >
                    <Typography align="center" className=" table-head fw-500">
                      SPD
                    </Typography>{" "}
                    <Typography className="table-freecell"> </Typography>
                    <Grid item>
                      {sensorValue?.SpdValues?.DATASTREAMS?.map(
                        (item, index) => {
                          return (
                            <>
                              <Typography
                                align="center"
                                // className="width100 table-cell fw-500"
                                className={
                                  sensorValue?.spdSensorsThreshold < item.value
                                    ? "width100 table-cell table-cellbg fw-500  fs-14"
                                    : "width100  table-cell fw-500 fs-14"
                                }
                              >
                                SPD{index + 1} :
                                <span className="width100    fw-500">
                                  {item.value} KA
                                </span>
                              </Typography>
                            </>
                          );
                        },
                      )}
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
              {sensorValue && sensor && deviceID2 === sensorValue._id && (
                showGraph ? (
                  <Suspense
                    fallback={
                      <div className="mt-8 h-80 rounded-xl bg-slate-100 animate-pulse" />
                    }
                  >
                    <DeviceGraph
                      device={sensorValue}
                      deviceID2={deviceID2}
                      sensor={sensor}
                      setSensor={setSensor}
                      SensorTypeChange={SensorTypeChange}
                      intervalId={intervalId}
                    />
                  </Suspense>
                ) : (
                  <div className="mt-8 h-80 rounded-xl bg-slate-100 animate-pulse" />
                )
              )}
            </TabPanel>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
