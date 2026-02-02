import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";

import RadioGroup from "@mui/material/RadioGroup";
import {
  Grid,
  Typography,
  DialogContent,
  FormControlLabel,
  InputBase,
  ListItemButton,
  FormLabel,
  Box,
  Tabs,
  Tab,
  Checkbox,
  FormGroup,
} from "@mui/material";
//React Icons
import SearchIcon from "@mui/icons-material/Search";
import { FETCH_URL } from "../../../../../../fetchIp";

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
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "0px",
  backgroundColor: "rgba(247, 248, 253, 1)",
  "&:hover": {
    backgroundColor: "rgba(247, 248, 253, 1)",
  },
  marginLeft: 0,
  width: "100%",
  fontWeight: "400",
  // [theme.breakpoints.up("lg")]: {
  //   marginLeft: theme.spacing(1),
  //   width: "auto",
  // },
  width: "36%",
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        width: "93%",
      },
    },
  },
}));

export default function CustomizedDialogs(props) {
  const {
    states: {
      sitesDeviceData,
      siteDeviceUid,
      sitesData,
      siteUid,
      device,
      resistanceNumber,
      originalDeviceData,
      resValue,
      spdNumber,
      gnNumber,
      phaseNumber,
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

  // console.log(" sensorValue ", sensorValue);

  const getnumberOfDevice = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/device/getDeviceById/${originalDeviceData}`,
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
      // // console.log("get DeviceById List resp ===> ", res.msg);
      setSensorValue(res.msg);
    } else {
      // console.log("Error in get site List ==> ", res);
    }
  };
  useEffect(() => {
    getnumberOfDevice();
  }, []);

  // Sensor Value Show Function Start
  const [rValue, setRValue] = useState([]);
  // console.log("Check R Value in Assign Sensor", rValue);
  function setResSensor() {
    let arr = [];
    for (let i = 0; i < new Array(sensorValue?.resSensors).length; i++) {
      arr.push(`R${i + 1}`);
    }
    setRValue(arr);
  }

  const [gnValue, setGnValue] = useState([]);
  function setGnSensor() {
    let arr = [];
    for (let i = 0; i < new Array(sensorValue?.nerSensors).length; i++) {
      arr.push(`GN${i + 1}`);
    }
    setGnValue(arr);
  }
  const [vmrValue, setVmrValue] = useState([]);
  function setVmrSensor() {
    let arr = [];
    for (let i = 0; i < new Array(sensorValue?.vmrSensors).length; i++) {
      arr.push(`PH${i + 1}`);
    }
    setVmrValue(arr);
  }
  const [spValue, setSPalue] = useState([]);
  function setSpdSensor() {
    let arr = [];
    for (let i = 0; i < new Array(sensorValue?.spdSensors).length; i++) {
      arr.push(`SPD${i + 1}`);
    }
    setSPalue(arr);
  }

  React.useEffect(() => {
    setResSensor();
    setVmrSensor();
    setSpdSensor();
    setGnSensor();
  }, [sensorValue]);

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
                        {sitesData}
                        <Typography className="subheading-grey600">
                          {siteUid}
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
          <Tabs
            value={value}
            onChange={TabChange}
            className="Tabs-dashboard2"
            style={{ padding: "0px 10px" }}
          >
            <Tab
              className="Tab-dashboardlabel-sensor  fs-16"
              label="Resistance "
            />
            <Tab className="Tab-dashboardlabel-sensor  fs-16" label="GN " />
            <Tab className="Tab-dashboardlabel-sensor  fs-16" label="Phase  " />
            <Tab className="Tab-dashboardlabel-sensor  fs-16" label="SPD " />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {rValue?.map((data, i) => {
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
            {/* <Grid
              container
              direction="row"
              alignItems="center"
              className=" widthLR-90"
            >
              <FormGroup>
                <FormControlLabel
                  className="greycolor505050500 fs16px mt-12 "
                  control={
                    <Checkbox
                      className="purple-icon"
                      checked={
                        resistanceNumber?.length === device?.length
                          ? true
                          : false
                      }
                    />
                  }
                  label={
                    <Typography className="greycolor505050500 fs16px">
                      Select all
                    </Typography>
                  }
                  onChange={(e) => {
                    storeSensorData(null, "selectAll");
                  }}
                />
              </FormGroup>
              <Typography className="greycolor505050500 fs16px">
                {billBoardArr?.length} Selected
              </Typography>
            </Grid> */}
            <Grid container className="widthLR-90 ">
              {gnValue?.map((item, i) => {
                return (
                  <>
                    <Grid>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        value={item}
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={gnNumber?.includes(item)}
                            value={item}
                          />
                        }
                        onChange={(e) => storeGnValue(e, item, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {item}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {vmrValue?.map((item, i) => {
                return (
                  <>
                    <Grid>
                      <FormControlLabel
                        style={{
                          width: "160px",
                        }}
                        className="billboard-screencheckbox  mt-16"
                        control={
                          <Checkbox
                            className="icons-blue"
                            checked={phaseNumber?.includes(item)}
                          />
                        }
                        value={item}
                        onChange={(e) => storePhaseValue(e, item, i)}
                        label={
                          <React.Fragment>
                            <Typography className=" mt-8 fw-500">
                              {item}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container direction="row">
            <Grid container className="widthLR-90 ">
              {spValue?.map((item, i) => {
                return (
                  <>
                    <FormControlLabel
                      style={{
                        width: "160px",
                      }}
                      className="billboard-screencheckbox  mt-16"
                      value={item}
                      control={
                        <Checkbox
                          className="icons-blue"
                          checked={spdNumber?.includes(item)}
                        />
                      }
                      onChange={(e) => storeSpdValue(e, item, i)}
                      label={
                        <React.Fragment>
                          <Typography className=" mt-8 fw-500">
                            {item}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </>
                );
              })}
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
    </div>
  );
}
