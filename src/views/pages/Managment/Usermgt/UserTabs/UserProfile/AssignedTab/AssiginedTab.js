import React, { useCallback, useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { IoChevronBackOutline } from "react-icons/io5";
import NodataFound from "../../../../../../../assets/img/nodatafound.png";
import AssignSite from "./UserAssignedAction/AssignSite";
import DeviceDelete from "./UserAssignedAction/UserDeviceDelete";
import DeleteSite from "./UserAssignedAction/UserSiteDelete";
import ViewProfile from "./SensorProfile";
import AssignDevice from "./UserAssignedAction/AssignDevice/AssignDevice";
import EditDeviceSensor from "./UserAssignedAction/EditDeviceSensor";
import SensorShow from "./UserAssignedAction/AssignDevice/AssignSensorShow";
import { GET, POST } from "../../../../../../../lib/request";
import { API } from "../../../../../../../lib/endpoint";

export default function Sites({ state }) {
  const [useraSite, setuseraSite] = useState(null);
  const [deviceview, setDeviceView] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [selectSite, setSelectSiteName] = useState(null);
  const [selectUid, setSelectUid] = useState(null);
  // console.log("Check state state", state._id);
  const [device, setDevice] = useState(null);

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
  const getnumberOfAssignSite = useCallback(async () => {
    try {
      const res = await GET(API.SITE.BY_USER(state?._id));

      console.log("Assigned Site List =>", res.msg);
      setuseraSite(res.msg);
    } catch (err) {
      console.log("Error fetching assigned sites", err);
    }
  }, [state?._id]);

  const getdevicebyuserId = useCallback(async () => {
    try {
      if (!siteId || !state?._id) return;
      const res = await POST(API.DEVICE.BY_SITE_AND_USER, {
        siteId: siteId,
        userId: state?._id,
      });

      setDevice(res.msg);
    } catch (err) {
      console.log("Error fetching device list", err);
    }
  }, [siteId, state?._id]);

  useEffect(() => {
    getnumberOfAssignSite();
  }, [getnumberOfAssignSite]);
  useEffect(() => {
    getdevicebyuserId();
  }, [getdevicebyuserId]);

  return (
    <>
      <Grid container direction="row" className="mt-8 w-full">
        {deviceview ? (
          <>
            {/* HEADER */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography
                className="subheading-grey600 cursor"
                onClick={SiteDataView}
              >
                ← Back
              </Typography>

              <div className="h-10">
                <AssignDevice
                  deviceID={device}
                  UserId={state?._id}
                  state={state}
                  siteId={siteId}
                  selectUid={selectUid}
                  getdevicebyuserId={getdevicebyuserId}
                />
              </div>
            </Grid>

            {/* SITE INFO */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="text-gray-500">
                UID: <span className="text-blue-500">{selectUid}</span>
              </span>
              <span className="text-gray-500">
                Site Name: <span className="text-blue-500">{selectSite}</span>
              </span>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto mt-6 mb-10">
              <Table className="min-w-[900px]">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-center text-sm">UID</TableCell>
                    <TableCell className="text-center text-sm">
                      Device Name
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Assigned Sensors
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Added On
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Updated On
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {device?.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell className="text-center px-3 py-2 text-xs md:text-sm text-blue-500">
                        {row.nodeUid}
                      </TableCell>

                      <TableCell className="text-center cursor">
                        <ViewProfile
                          sensorValue={row}
                          SiteName={selectSite}
                          selectUid={selectUid}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <SensorShow
                          user={state}
                          sensorValue={row}
                          SiteName={selectSite}
                          selectUid={selectUid}
                          siteId={siteId}
                        />
                      </TableCell>

                      <TableCell className="text-center text-gray-700">
                        {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell className="text-center text-gray-700">
                        {dayjs(row?.updatedAt).format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2 justify-center flex-wrap">
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* NO DATA */}
            {device?.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-10">
                <img src={NodataFound} alt="" />
                <p className="mt-4 text-gray-700">No Device found!</p>

                <div className="mt-4">
                  <AssignDevice
                    deviceID={device}
                    UserId={state?._id}
                    state={state}
                    siteId={siteId}
                    selectUid={selectUid}
                    getdevicebyuserId={getdevicebyuserId}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center w-full">
              <p className="text-gray-700 text-sm">
                Showing {useraSite?.length} Sites
              </p>

              <AssignSite
                UserId={state?._id}
                getnumberOfAssignSite={getnumberOfAssignSite}
              />
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto mt-6 mb-10">
              <Table className="min-w-[800px]">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-center text-sm">UID</TableCell>
                    <TableCell className="text-center text-sm">Sites</TableCell>
                    <TableCell className="text-center text-sm">
                      Devices
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Added On
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {useraSite?.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell
                        className="text-center cursor text-blue-500"
                        onClick={() => DeviceDataView(row)}
                      >
                        {row.uid}
                      </TableCell>

                      <TableCell
                        className="text-center cursor text-blue-500"
                        onClick={() => DeviceDataView(row)}
                      >
                        {row.siteName}
                      </TableCell>

                      <TableCell className="text-center">
                        {row.deviceCount}
                      </TableCell>

                      <TableCell className="text-center">
                        {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center">
                          <DeleteSite
                            SiteID={row._id}
                            UserId={state?._id}
                            getnumberOfAssignSite={getnumberOfAssignSite}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* NO DATA */}
            {useraSite?.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-10">
                <img src={NodataFound} alt="" />
                <p className="mt-4 text-gray-700">No Site Assign!</p>

                <div className="mt-4">
                  <AssignSite
                    UserId={state?._id}
                    getnumberOfAssignSite={getnumberOfAssignSite}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
