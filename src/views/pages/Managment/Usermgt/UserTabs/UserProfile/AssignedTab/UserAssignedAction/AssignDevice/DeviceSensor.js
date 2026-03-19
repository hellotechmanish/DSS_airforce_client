import React, { useCallback, useEffect, useMemo, useState } from "react";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";

import RadioGroup from "@mui/material/RadioGroup";
import {
  Grid,
  Typography,
  DialogContent,
  FormControlLabel,
  ListItemButton,
  FormLabel,
  Box,
  Tabs,
  Tab,
  Checkbox,
} from "@mui/material";

import { API } from "../../../../../../../../../lib/endpoint";
import { GET } from "../../../../../../../../../lib/request";

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

export default function CustomizedDialogs(props) {
  const {
    states: {
      sitesData,
      originalDeviceData,
      resValue,
      spdNumber,
      gnNumber,
      phaseNumber,
      state,
      sitesDeviceData,
      siteDeviceUid,
      selectUid,
    },
    storeResValue,
    storeSpdValue,
    storeGnValue,
    storePhaseValue,
  } = props; // States

  const [sensorValue, setSensorValue] = useState(null);

  //=================================================//

  const [value, setValue] = React.useState(0);
  const TabChange = (event, newValue) => {
    setValue(newValue);
  };

  // const Reslength = sensorValue?.ResValues?.DATASTREAMS?.map(
  //   (title) => title?.length
  // );
  // // console.log(" Reslength ", Reslength);

  // // console.log(" originalData ", originalData);

  const getnumberOfDevice = useCallback(async () => {
    try {
      if (!originalDeviceData) return;
      const res = await GET(API.DEVICE.GET_BY_ID(originalDeviceData));
      setSensorValue(res.msg);
    } catch (err) {
      console.log("Error fetching device data", err);
    }
  }, [originalDeviceData]);

  useEffect(() => {
    getnumberOfDevice();
  }, [getnumberOfDevice]);

  const rValue = useMemo(
    () =>
      Array.from({ length: Number(sensorValue?.resSensors || 0) }, (_, i) => {
        return `R${i + 1}`;
      }),
    [sensorValue?.resSensors],
  );

  const gnValue = useMemo(
    () =>
      Array.from({ length: Number(sensorValue?.nerSensors || 0) }, (_, i) => {
        return `GN${i + 1}`;
      }),
    [sensorValue?.nerSensors],
  );

  const vmrValue = useMemo(
    () =>
      Array.from({ length: Number(sensorValue?.vmrSensors || 0) }, (_, i) => {
        return `PH${i + 1}`;
      }),
    [sensorValue?.vmrSensors],
  );

  const spValue = useMemo(
    () =>
      Array.from({ length: Number(sensorValue?.spdSensors || 0) }, (_, i) => {
        return `SPD${i + 1}`;
      }),
    [sensorValue?.spdSensors],
  );

  return (
    <div>
      <DialogContent sx={{ m: 0 }}>
        <Grid container className="mt-32">
          <Grid item>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className="width100"
            >
              <Typography
                sx={{ marginLeft: "20px" }}
                className="heading-black width100"
              >
                Selected Site
              </Typography>
              <Grid
                item
                sx={{
                  border: "1px solid #dddddd",
                  marginLeft: "20px",
                }}
                className="access-radio-grid-no-mt mt-8"
              >
                <Grid container justifyContent="space-between">
                  <FormLabel>
                    <ListItemButton>
                      <Typography className=" heading-black">
                        {state?.fullName}
                        <Typography className="subheading-grey600">
                          {selectUid}
                        </Typography>
                      </Typography>
                    </ListItemButton>
                  </FormLabel>
                  <FormControlLabel
                    value={sitesData}
                    className="radiostyle access-radio-formcontrolabel"
                    control={<Radio checked={true} />}
                    style={{ justifyContent: "space-between" }}
                    key={sitesData}
                  />
                </Grid>
              </Grid>
            </RadioGroup>{" "}
          </Grid>
          <Grid item>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className="width100"
            >
              <Typography className="heading-black width100">
                Selected Device
              </Typography>
              <Grid
                item
                sx={{
                  border: "1px solid #dddddd",
                }}
                className="access-radio-grid-no-mt mt-8"
              >
                <Grid container justifyContent="space-between">
                  <FormLabel>
                    <ListItemButton>
                      <Typography className=" heading-black">
                        {sitesDeviceData}
                        <Typography className="subheading-grey600">
                          {siteDeviceUid}
                        </Typography>
                      </Typography>
                    </ListItemButton>
                  </FormLabel>
                  <FormControlLabel
                    value={sitesDeviceData}
                    className="radiostyle access-radio-formcontrolabel"
                    control={<Radio checked={true} />}
                    style={{ justifyContent: "space-between" }}
                    key={sitesDeviceData}
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
        </Grid>

        <Box className="tab-user-box mt-24">
          <Tabs value={value} onChange={TabChange} className="Tabs-dashboard2">
            <Tab
              className="Tab-dashboardlabel2 fs-16 ml-12 mr-12"
              label="Resistance"
            />
            <Tab
              className="Tab-dashboardlabel2 fs-16  ml-12 mr-12"
              label="GN"
            />
            <Tab
              className="Tab-dashboardlabel2 fs-16  ml-12 mr-12"
              label="Phase"
            />
            <Tab
              className="Tab-dashboardlabel2 fs-16  ml-12 mr-12"
              label="SPD"
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {rValue?.map((data, i) => {
                // // console.log("Check data==========>", data);
                return (
                  <>
                    <Grid item>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        value={data}
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={resValue?.includes(data)}
                          />
                        }
                        onChange={(e) => storeResValue(e, data, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {data}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>{" "}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {gnValue?.map((data, i) => {
                return (
                  <>
                    <Grid item>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        value={data}
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={gnNumber?.includes(data)}
                          />
                        }
                        onChange={(e) => storeGnValue(e, data, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {data}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>{" "}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {vmrValue?.map((data, i) => {
                return (
                  <>
                    <Grid item>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        value={data}
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={phaseNumber?.includes(data)}
                          />
                        }
                        onChange={(e) => storePhaseValue(e, data, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {data}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>{" "}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {spValue?.map((data, i) => {
                return (
                  <>
                    <Grid item>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        value={data}
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={spdNumber?.includes(data)}
                          />
                        }
                        onChange={(e) => storeSpdValue(e, data, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {data}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>{" "}
        </TabPanel>
      </DialogContent>
    </div>
  );
}
