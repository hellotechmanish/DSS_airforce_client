import React, { useState, useEffect } from "react";
import { Typography, Grid, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { IoChevronBackOutline } from "react-icons/io5";
import NodataFound from "../../../../../../../assets/img/nodatafound.png";
import { FETCH_URL } from "../../../../../../../fetchIp";
import AssignSite from "./UserAssignedAction/AssignSite";
import DeviceDelete from "./UserAssignedAction/UserDeviceDelete";
import DeleteSite from "./UserAssignedAction/UserSiteDelete";
import ViewProfile from "./SensorProfile";
import AssignDevice from "./UserAssignedAction/AssignDevice/AssignDevice";
import EditDeviceSensor from "./UserAssignedAction/EditDeviceSensor";
import SensorShow from "./UserAssignedAction/AssignDevice/AssignSensorShow";
export default function Sites({ state }) {
  const [useraSite, setuseraSite] = useState(null);
  const [deviceview, setDeviceView] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [selectSite, setSelectSiteName] = useState(null);
  const [selectUid, setSelectUid] = useState(null);
  // console.log("Check state state", state._id);

  const DeviceDataView = (row) => {
    // console.log("Check Assign USer ID & SiteID", row);
    setDeviceView(true);
    setSiteId(row._id);
    setSelectSiteName(row?.siteName);
    setSelectUid(row?.uid);
  };
  const SiteDataView = (row) => {
    setDeviceView(false);
    // setSiteId(row._id);
    // setSelectSiteName(row?.siteName);
    // setSelectUid(row?.uid);
  };
  // // console.log("Check Device Data on OnClick", deviceview);
  const getnumberOfAssignSite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/site/getSiteByUserId/${state?._id}`,
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
      console.log("  get number Of User  List resp ===> ", res.msg);
      setuseraSite(res.msg);
    } else {
      // console.log("Error in get technician List ==> ", res);
    }
  };
  const [device, setDevice] = useState(null);

  const getdevicebyuserId = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/device/getdeviceListbysiteIdanduserId`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: siteId,
          userId: state?._id,
        }),
      }
    );
    let res = await response.json();
    if (response.ok) {
      // console.log(" get device List by site Id resp ===> ", res.msg);
      setDevice(res.msg);
    } else {
      // // console.log("Error in get device List by site Id ==> ", res);
    }
  };

  useEffect(() => {
    getnumberOfAssignSite();
  }, []);
  useEffect(() => {
    getdevicebyuserId(siteId);
  }, [siteId]);

  return (
    <>
      <Grid container direction="row" className=" mt-8 width100">
        {deviceview ? (
          <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                className="subheading-grey600 "
                onClick={SiteDataView}
                alignItems="center"
                alignSelf="center"
                align="center"
              >
                <span>
                  <IoChevronBackOutline
                    className="fs-14 cursor"
                    onClick={SiteDataView}
                  />
                </span>
                <span className="ml-8 fs-18  cursor ">Back</span>
              </Typography>
              <div className="hgt-40">
                <AssignDevice
                  deviceID={device}
                  UserId={state?._id}
                  state={state}
                  siteId={siteId}
                  selectUid={selectUid}
                  getdevicebyuserId={getdevicebyuserId}
                />{" "}
              </div>
            </Grid>
            <Grid container>
              <Grid container item className="mt-16">
                <Typography className="subheading-grey600 "> UID :</Typography>
                <Typography className="sky-typo  ml-4"> {selectUid}</Typography>
                <Typography className="subheading-grey600   ml-24">
                  {" "}
                  Site Name:
                </Typography>
                <Typography className="sky-typo   ml-4">
                  {selectSite}
                </Typography>
              </Grid>
            </Grid>
            <TableContainer className="width100 table-container mt-16 mb-20">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      {" "}
                      Device Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      {" "}
                      Assigned Sensors
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      {" "}
                      Added on
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      {" "}
                      Updated on{" "}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      {" "}
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {device?.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell
                        align="center"
                        className="p-0 sky-typo"
                        component="th"
                        scope="row"
                      >
                        <span className="sky-typo"> {row.nodeUid} </span>
                      </TableCell>
                      <TableCell align="center" className="sky-typo cursor ">
                        <ViewProfile
                          sensorValue={row}
                          SiteName={selectSite}
                          selectUid={selectUid}
                        />
                      </TableCell>
                      <TableCell align="center" className=" cursor">
                        <SensorShow
                          user={state}
                          sensorValue={row}
                          SiteName={selectSite}
                          selectUid={selectUid}
                          siteId={siteId}
                        />
                      </TableCell>
                      <TableCell align="center" className="heading-black ">
                        {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="center" className="heading-black ">
                        {dayjs(row?.updatedAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        <Grid
                          container
                          justifyContent="space-evenly"
                          direction="row"
                        >
                          <EditDeviceSensor
                            SiteName={selectSite}
                            selectUid={selectUid}
                            device={row}
                            UserId={state?._id}
                            getdevicebyuserId={getdevicebyuserId}
                          />

                          <DeviceDelete
                            DeviceID={row?._id}
                            userId={state?._id}
                            getdevicebyuserId={getdevicebyuserId}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {device?.length === 0 && (
              <Grid container className=" mb-40">
                <Grid item className="mt-32 width100">
                  <Typography align="center">
                    <img src={NodataFound} />{" "}
                  </Typography>
                </Grid>
                <Typography
                  className="heading-black width100 mt-42"
                  align="center"
                >
                  No Device found!
                </Typography>
                <Typography
                  className="heading-black width100 mt-24"
                  align="center"
                >
                  Click below button to add User
                </Typography>
                <Typography align="center" className="width100 mt-16">
                  <AssignDevice
                    deviceID={device}
                    UserId={state?._id}
                    state={state}
                    siteId={siteId}
                    selectUid={selectUid}
                    getdevicebyuserId={getdevicebyuserId}
                  />
                </Typography>
              </Grid>
            )}
          </>
        ) : (
          <>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography className="heading-black mt-12">
                Showing
                {useraSite?.length === 1 ? (
                  <span> {useraSite?.length} Site </span>
                ) : (
                  <span> {useraSite?.length} Sites </span>
                )}
              </Typography>
              <Grid item className="hgt-40">
                <AssignSite
                  UserId={state?._id}
                  getnumberOfAssignSite={getnumberOfAssignSite}
                />
              </Grid>
            </Grid>

            <TableContainer className="width100 table-container  mt-24 mb-20">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Sites
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Devices
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Added on
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {useraSite?.map((row) => {
                    return (
                      <>
                        <TableRow key={row.name}>
                          <TableCell
                            align="center"
                            className="p-0 sky-typo cursor  "
                            component="th"
                            scope="row"
                            onClick={() => DeviceDataView(row)}
                          >
                            <span className="hover"> {row.uid}</span>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="sky-typo cursor "
                            onClick={() => DeviceDataView(row)}
                          >
                            <span className="hover"> {row.siteName} </span>
                          </TableCell>
                          <TableCell align="center" className="heading-black ">
                            {row.deviceCount}
                          </TableCell>
                          <TableCell align="center" className="heading-black ">
                            {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell align="center">
                            <Grid
                              container
                              justifyContent="space-evenly"
                              direction="row"
                            >
                              <DeleteSite
                                SiteID={row._id}
                                UserId={state?._id}
                                getnumberOfAssignSite={getnumberOfAssignSite}
                              />
                            </Grid>
                          </TableCell>
                        </TableRow>{" "}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {useraSite?.length === 0 && (
              <Grid container className="mb-40">
                <Grid item className="mt-32 width100">
                  <Typography align="center">
                    <img src={NodataFound} />{" "}
                  </Typography>
                </Grid>
                <Typography
                  className="heading-black width100 mt-42"
                  align="center"
                >
                  No Site Assign!
                </Typography>
                <Typography
                  className="heading-black width100 mt-24"
                  align="center"
                >
                  Click below button to Assign Site
                </Typography>
                <Typography align="center" className="hgt-40 width100 mt-12">
                  <AssignSite
                    UserId={state?._id}
                    getnumberOfAssignSite={getnumberOfAssignSite}
                  />
                </Typography>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
