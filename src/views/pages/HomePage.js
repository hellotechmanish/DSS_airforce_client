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
    setLoading(true);
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(`${FETCH_URL}/api/site/getnumberOfSite`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let res = await response.json();

    if (response.ok) {
      setSites(res.msg);
      setSetID(res.msg[0]._id);
      setSiteZero(res.msg[0]);
      setLoading(false);
    } else {
      // // console.log("Error in get number Of Site ==> ", res);
    }
  };

  const getdeviceListbysite = async (sitesID) => {
    setLoading(true);
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(
        `${FETCH_URL}/api/device/getdeviceListbysiteId/${sitesID}`,
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
        setDevice(res.msg);
        setLoading(false);
      } else {
        // // console.log("Error in get device List by site Id ==> ", res);
      }
    } catch (err) {
      console.log("Error in get device List by site Id ==> ", err);
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
