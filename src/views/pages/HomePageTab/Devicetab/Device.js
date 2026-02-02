// Import Server Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Grid } from "@mui/material";

// Import Custom Component
import { FETCH_URL } from "../../../../fetchIp";
import DeviceGraph from "./DeviceGraph";
import Viewprofile from "../viewprofielDiialog";

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
  const intervalId = React.useRef(sensor);

  const getDeviceById = async (deviceID) => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/device/getDeviceById/${deviceID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let res = await response.json();
    if (response.ok) {
      setSensorValue(res.msg);
    } else {
      // //("Error in getDeviceById ==> ", res);
    }
  };
  const handleChange2 = (event, newValue) => {
    setValue1(newValue);
    getDeviceById(deviceID[newValue]?._id);
    setDeviceID2(deviceID[newValue]?._id);
    setSensor("RES");
  };
  useEffect(() => {
    // //("deviceId  ===>", deviceID);
    setDeviceID2(deviceID[0]?._id);
  }, [deviceID]);

  useEffect(() => {
    getDeviceById(deviceID2);
  }, [deviceID2]);

  useEffect(() => {
    let interval = setInterval(() => {
      getDeviceById(deviceID2);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [deviceID2, value1]);

  const SensorTypeChange = (newValue) => {
    setSensor(newValue);
  };

  return (
    <>
      <Grid container className="widthLR-90 ">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <>
              <Tabs
                value={value1}
                onChange={handleChange2}
                className="Tabs-dashboard2"
                variant={value1 == 0 ? null : "scrollable"}
                scrollButtons={value1 == 0 ? null : "auto"}
                aria-label="scrollable auto tabs example"
              >
                {deviceID?.length > 0 ? (
                  deviceID?.map((item, index) => {
                    return (
                      <Tab
                        className="Tab-dashboardlabel2 fs-16 mr-20 hover "
                        {...a11yProps(index)}
                        label={
                          <>
                            <Typography className="sitesname ">
                              {item?.deviceName}
                            </Typography>
                          </>
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
            </>
          </Grid>
        </Grid>
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
                          (sensorValue?.nerSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.spdSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.resSensors)
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
                        }
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
                          (sensorValue?.nerSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.spdSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.vmrSensors)
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
                        }
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
                          (sensorValue?.vmrSensors && sensorValue?.resSensors)
                        ? 9
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.spdSensors)
                        ? 8
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.nerSensors)
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                          (sensorValue?.spdSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.spdSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.spdSensors)
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
                        }
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
                          (sensorValue?.nerSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.spdSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.resSensors)
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
                        }
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
                          (sensorValue?.nerSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.spdSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.vmrSensors)
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
                        }
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
                          (sensorValue?.vmrSensors && sensorValue?.resSensors)
                        ? 9
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.spdSensors)
                        ? 8
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.nerSensors)
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                          (sensorValue?.spdSensors && sensorValue?.resSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.nerSensors && sensorValue?.spdSensors)
                        ? 5.25
                        : 0 ||
                          (sensorValue?.vmrSensors && sensorValue?.spdSensors)
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
                        }
                      )}
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
              {sensorValue && sensor && deviceID2 === sensorValue._id && (
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
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
