import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Breadcrumbs,
  Grid,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AddDeviceDialog from "../../DeviceMgt/AddDevice/AddDevice";
import { FETCH_URL } from "../../../../../fetchIp";
import Viewprofile from "../../DeviceMgt/DeviceProfile/DeviceprofielDiialog";
import NodataFound from "../../../../../assets/img/nodatafound.png";
import DeviceGraph from "./DeviceGraph";
import { AuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../api/axiosInstance";

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
export default function Sites() {
  const { state } = useLocation();
  const [value, setValue] = React.useState(0);

  const [device, setDevice] = useState(null);
  const [deviceID2, setDeviceID2] = useState(null);
  const [sensor, setSensor] = useState("RES");
  const [sensorValue, setSensorValue] = useState(null);

  const intervalId = React.useRef(sensor);

  const auth = React.useContext(AuthContext);
  const getdeviceListbysite = async () => {
    try {
      const response = await axiosInstance.get(
        `${FETCH_URL}/api/device/getdeviceListbysiteId/${state?._id}`
      );
      const newDevices = response.data?.msg;
      setDevice(newDevices);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getnumberOfDevice = async (deviceID) => {
    try {
      // setLoadingDevice(true);
      const response = await axiosInstance.get(
        `${FETCH_URL}/api/device/getDeviceById/${deviceID}`
      );
      const newDevices = response.data?.msg;
      if (newDevices) {
        console.log(newDevices);
        setSensorValue(newDevices);
        setDeviceID2(newDevices?._id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const TabChange = (event, newValue) => {
    setValue(newValue);
    setSensor("RES");
    if (device) {
      getnumberOfDevice(device[newValue]?._id);
      setDeviceID2(device[newValue]?._id);
    }
  };

  useEffect(() => {
    if (state) {
      getdeviceListbysite();
    }
  }, [state]);

  useEffect(() => {
    if (device) {
      setDeviceID2(device[0]?._id);
    }
  }, [device, state]);

  useEffect(() => {
    if (deviceID2) {
      getnumberOfDevice(deviceID2);
    }
  }, [deviceID2]);

  useEffect(() => {
    let interval = setInterval(() => {
      getnumberOfDevice(deviceID2);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [deviceID2]);

  const SensorTypeChange = (newValue) => {
    setSensor(newValue);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Grid container direction="row" className="widthLR-90 mt-24">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              to="/dashboard"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="sky-typo fs-16">Dashboard</Typography>
            </Link>
            ,
            <Link
              to="/sites-mgt"
              className="linkcolor"
              underline="hover"
              key="2"
            >
              <Typography className="heading-black  ">
                Site Management
              </Typography>
            </Link>
            ,
            <Typography className="heading-black">{state?.siteName}</Typography>
          </Breadcrumbs>
        </Grid>
      </Container>
      <div className="sites-profilehead mt-16">
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            className="widthLR-90"
          >
            <Grid item>
              <Typography className="white-typo mt-12 fs-20 ">
                {state?.siteName}
              </Typography>
              <Typography className="white-typo mt-12 ">
                {state?.location}
              </Typography>
              <Typography className="white-typo mb-10 ">
                {state?.pincode},
                <span className="white-typo mt-12 ml-4">{state?.country}</span>
              </Typography>
            </Grid>
            <Grid item>
              <Grid container justifyContent="flex-end" alignItems="flex-end">
                <Typography className="white-typo mt-16">
                  Last Modified :
                  <span className="white-typo">
                    {new Date(state?.createdAt)
                      .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\./g, "/")}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Container maxWidth="xl">
        <div className="widthLR-90">
          {auth.user.role === 2 || auth.user.role === 1 ? null : (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="heading-black mt-12">
                Showing{" "}
                <span>
                  {device?.length} {device?.length === 1 ? "Device" : "Devices"}
                </span>
              </Typography>
              <Grid item className="mt-16 hgt-40">
                <AddDeviceDialog
                  state={state}
                  getdeviceListbysite={getdeviceListbysite}
                />
              </Grid>
            </Grid>
          )}

          <Grid container direction="row">
            <Grid container item sx={{ width: "100%" }}>
              <Tabs
                value={value}
                onChange={TabChange}
                className="Tabs-dashboard2"
                variant={value === 0 ? null : "scrollable"}
                scrollButtons={value === 0 ? null : "auto"}
              >
                {device && device?.length > 0
                  ? device?.map((data, index) => {
                      return (
                        <Tab
                          className="Tab-dashboardlabel2 fs-16 mr-20 hover hgt-40"
                          {...a11yProps(index)}
                          label={
                            <>
                              <Typography className="sitesname">
                                {data.deviceName}
                              </Typography>
                            </>
                          }
                        />
                      );
                    })
                  : null}
              </Tabs>
            </Grid>
          </Grid>
          {device && device?.length > 0 ? (
            <Grid container className="mt-16 mb-40" sx={{ height: "100vh" }}>
              <TabPanel value={value} index={value} className="width100">
                <Grid container className="border-grey mt-16">
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
                            getdeviceListbysite={getdeviceListbysite}
                            getnumberOfDevice={getnumberOfDevice}
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
                        className="width100  table-head  fw-500"
                      >
                        RESISTANCE
                      </Typography>
                      <Typography
                        className="table-freecell"
                        sx={{ borderLeft: "2px solid #dddddd" }}
                      ></Typography>
                      <Grid item>
                        {sensorValue.ResValues &&
                          sensorValue?.ResValues?.DATASTREAMS?.map(
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
                  {sensorValue && sensorValue?.nerSensors ? (
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
                        {sensorValue?.NerValues &&
                          sensorValue?.NerValues?.DATASTREAMS?.map(
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

                  {sensorValue && sensorValue?.vmrSensors ? (
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <Grid item>
                                        <Typography
                                          align="center"
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <Grid item>
                                        <Typography
                                          align="center"
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <Grid item>
                                        <Typography
                                          align="center"
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <Grid item>
                                        <Typography
                                          align="center"
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
                            {sensorValue?.VmrValues &&
                              sensorValue?.VmrValues?.DATASTREAMS?.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <Grid item>
                                        <Typography
                                          align="center"
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
                        {sensorValue?.SpdValues &&
                          sensorValue?.SpdValues?.DATASTREAMS?.map(
                            (item, index) => {
                              return (
                                <>
                                  <Typography
                                    align="center"
                                    className={
                                      sensorValue?.spdSensorsThreshold <
                                      item.value
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
            </Grid>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "50vh" }}
            >
              <Grid item>
                <img alt="NodataFound" src={NodataFound} />
                <Typography align="center" className="mt-16 blue-typo">
                  No Device found! <br />
                  Click below button to add Device
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item className="mt-16">
                    <AddDeviceDialog
                      state={state}
                      getdeviceListbysite={getdeviceListbysite}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      </Container>
    </>
  );
}
