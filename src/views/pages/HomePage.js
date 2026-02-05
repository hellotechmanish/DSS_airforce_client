// Import Server Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Grid } from "@mui/material";
// Import Custom Component
import { FETCH_URL } from "../../fetchIp";

import DeviceTab from "./HomePageTab/Devicetab/Device";
import { Container } from "@mui/system";
import NodataFound from "../../assets/img/nodatafound.png";
import AddDevice from "./HomePageTab/AddDevice/AddDevice";
import AddSiteDialog from "./Managment/SitesMgt/AddSite/SitesAddDialog";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";

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
function App() {
  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [sites, setSites] = useState(null);
  const [sitesID, setSetID] = useState(null);
  const [selectSiteData, setSelectSiteData] = useState(null);
  const [sitezero, setSiteZero] = useState(null);
  const [deviceID, setDevice] = useState([]);

  const getnumberOfSite = async () => {
    try {
      setLoading(true);

      const resp = await GET(API.SITE.COUNT);

      if (Array.isArray(resp?.msg)) {
        setSites(resp.msg);
        setSetID(resp.msg[0]?._id);
        setSiteZero(resp.msg[0]);
      }
    } catch (err) {
      console.error("Site Count Error =>", err);
    } finally {
      setLoading(false);
    }
  };

  const getdeviceListbysite = async (sitesID) => {
    if (!sitesID) return;

    try {
      setLoading(true);

      const resp = await GET(API.DEVICE.LIST_BY_SITE(sitesID));

      console.log("Device List =>", resp);

      if (Array.isArray(resp?.msg)) {
        setDevice(resp.msg);
      }
    } catch (err) {
      console.error("Device List Error =>", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getnumberOfSite();
  }, []);
  useEffect(() => {
    setValue1(0);
  }, [value, deviceID]);
  const TabChange = (event, newValue) => {
    setValue(newValue);
    setSelectSiteData(sites[newValue]);
    getdeviceListbysite(sites[newValue]._id);
  };
  useEffect(() => {
    getnumberOfSite();
  }, [selectSiteData]);
  useEffect(() => {
    getdeviceListbysite(sitesID);
  }, [sitesID]);

  return (
    <>
      {sites?.length > 0 ? (
        <Container maxWidth="xl">
          <Grid container className="widthLR-80">
            <Tabs
              value={value}
              onChange={TabChange}
              className="Tabs-dashboard hgt-48"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {sites?.length > 0 &&
                sites?.map((data, index) => {
                  return (
                    <Tab
                      className="Tab-dashboardlabel fs-20  mr-20 hover hgt-40"
                      {...a11yProps(index)}
                      label={
                        <>
                          <Typography className="sitesname">
                            {data?.siteName}
                            <span className="count-bg">
                              {data?.deviceCount}
                            </span>
                          </Typography>
                        </>
                      }
                    />
                  );
                })}
            </Tabs>
          </Grid>
          {deviceID && deviceID?.length > 0 ? (
            <TabPanel value={value} index={value} className="width100">
              <DeviceTab
                deviceID={deviceID}
                value1={value1}
                setValue1={setValue1}
              />
            </TabPanel>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "80vh" }}
            >
              <Grid item>
                <img alt="NodataFound" src={NodataFound} />
                <Typography align="center" className="mt-16 blue-typo">
                  No Device found! <br />
                  Click below button to add Device
                </Typography>
                <Typography align="center" className="mt-16 blue-typo">
                  <AddDevice
                    getnumberOfSite={getnumberOfSite}
                    getdeviceListbysite={getdeviceListbysite}
                    state={selectSiteData}
                    sitezero={sitezero}
                    value={value}
                  />
                </Typography>
              </Grid>
            </Grid>
          )}
        </Container>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "80vh" }}
        >
          <Grid item>
            <img alt="NodataFound" src={NodataFound} />
            <Typography align="center" className="mt-16 blue-typo">
              No Site found!
              <br />
              Click below button to add Site
            </Typography>
            <Typography align="center" className="mt-16">
              <AddSiteDialog getnumberOfSite={getnumberOfSite} />
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}
export default App;
