import React, { useState, useEffect } from "react";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
  Snackbar,
  RadioGroup,
  FormLabel,
  ListItemButton,
  FormControlLabel,
  Radio,
  Checkbox,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../../../../../fetchIp";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { CiEdit } from "react-icons/ci";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className="dialog-title-add" sx={{ m: 0, p: 1.2 }} {...other}>
      {children}
      <Typography className="white-typo">Edit Sensor </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon className="fs-20" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export default function MaxWidthDialog({
  getdevicebyuserId,
  UserId,
  device,
  SiteName,
  selectUid,
}) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);
  const TabChange = (event, newValue) => {
    setValue(newValue);
  };

  // SnackBar
  const [snackopen, setSnackOpen] = useState(false);
  const [snackmsg, setSnackMsg] = useState("");
  const [snackErrMsg, setSnackErrMsg] = useState();
  const [snackerropen, setSnackerropen] = useState(false);

  const SnanbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
    setSnackMsg("");
  };

  const SnackbarErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackerropen(false);
    setSnackErrMsg("");
  };
  const [siteid, setSitesid] = useState(null);
  // For Last Step
  // Data For Backend
  const [resValue, setResValue] = React.useState([]);
  const [spdNumber, setSpdNumber] = useState([]);
  const [gnNumber, setGnNumber] = useState([]);
  const [phaseNumber, setPhaseNumber] = useState([]);
  // // console.log("Check Save  resValue", resValue);
  function storeResValue(e, data, i) {
    let storeArr = [...resValue];
    let Element = storeArr.findIndex((item) => item === data);
    if (Element >= 0) {
      storeArr.splice(Element, 1);
    } else {
      storeArr.push(data);
    }
    setResValue(storeArr);
  }

  function storeSpdValue(e, data, i) {
    let storeArr = [...spdNumber];
    let Element = storeArr.findIndex((item) => item === data);
    if (Element >= 0) {
      storeArr.splice(Element, 1);
    } else {
      storeArr.push(data);
    }
    setSpdNumber(storeArr);
  }

  function storeGnValue(e, data, i) {
    let storeArr = [...gnNumber];
    let Element = storeArr.findIndex((item) => item === data);
    if (Element >= 0) {
      storeArr.splice(Element, 1);
    } else {
      storeArr.push(data);
    }
    setGnNumber(storeArr);
  }

  function storePhaseValue(e, data, i) {
    let storeArr = [...phaseNumber];
    let Element = storeArr.findIndex((item) => item === data);
    if (Element >= 0) {
      storeArr.splice(Element, 1);
    } else {
      storeArr.push(data);
    }
    setPhaseNumber(storeArr);
  }

  const [getSelectSensor, setGetSelectSensor] = useState(null);
  useEffect(() => {
    EditDeviceData();
  }, []);

  // Sensor Value Show Function Start
  const [rValue, setRValue] = useState([]);
  function setResSensor() {
    let arr = [];
    for (let i = 0; i < new Array(device?.resSensors).length; i++) {
      arr.push(`R${i + 1}`);
    }
    setRValue(arr);
  }

  const [gnValue, setGnValue] = useState([]);
  function setGnSensor() {
    let arr = [];
    for (let i = 0; i < new Array(device?.nerSensors).length; i++) {
      arr.push(`GN${i + 1}`);
    }
    setGnValue(arr);
  }
  const [vmrValue, setVmrValue] = useState([]);
  function setVmrSensor() {
    let arr = [];
    for (let i = 0; i < new Array(device?.vmrSensors).length; i++) {
      arr.push(`PH${i + 1}`);
    }
    setVmrValue(arr);
  }
  const [spValue, setSPalue] = useState([]);
  function setSpdSensor() {
    let arr = [];
    for (let i = 0; i < new Array(device?.spdSensors).length; i++) {
      arr.push(`SPD${i + 1}`);
    }
    setSPalue(arr);
  }

  React.useEffect(() => {
    setResSensor();
    setVmrSensor();
    setSpdSensor();
    setGnSensor();
  }, [device]);

  const EditDeviceData = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/getassignSensor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: UserId,
          deviceId: device?._id,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        // console.log("Check Res EditDevice Data", res.msg);
        setGetSelectSensor(res.msg);
      } else {
        // // console.log
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  const EditDevice = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/assignDeviceSensor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: UserId,
          deviceId: device?._id,
          phaseNumber: phaseNumber,
          resistanceNumber: resValue,
          spdNumber: spdNumber,
          gnNumber: gnNumber,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setSnackOpen(true);
        setSnackMsg(res.msg);
        setOpen(false);
        EditDeviceData();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };

  React.useEffect(() => {
    // console.log("React.useEffect  getSelectSensor", getSelectSensor?.length);
    if (getSelectSensor?.length > 0) {
      // console.log("getSelectSensor ===> ", getSelectSensor);
      setResValue(getSelectSensor[0]?.resistanceNumber);
      setSpdNumber(getSelectSensor[0]?.spdNumber);
      setGnNumber(getSelectSensor[0]?.gnNumber);
      setPhaseNumber(getSelectSensor[0]?.phaseNumber);
    }
  }, [getSelectSensor]);

  return (
    <React.Fragment>
      <Snackbar open={snackopen} autoHideDuration={3000} onClose={SnanbarClose}>
        <Alert onClose={SnanbarClose} severity={"success"}>
          {snackmsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackerropen}
        autoHideDuration={8000}
        onClose={SnackbarErrorClose}
      >
        <Alert onClose={SnackbarErrorClose} severity={"error"}>
          {snackErrMsg}
        </Alert>
      </Snackbar>
      <Tooltip title="Edit" className="tooltipheight">
        <IconButton className="mt-5px icons-blue" onClick={handleClickOpen}>
          <CiEdit />
        </IconButton>
      </Tooltip>
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "SmallDialog",
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        ></BootstrapDialogTitle>{" "}
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
                          {SiteName}
                          <Typography className="subheading-grey600">
                            {selectUid}
                          </Typography>
                        </Typography>
                      </ListItemButton>
                    </FormLabel>
                    <FormControlLabel
                      // value={sitesData}
                      className="radiostyle access-radio-formcontrolabel"
                      control={<Radio checked={true} />}
                      style={{ justifyContent: "space-between" }}
                      // key={sitesData}
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
                          {device.deviceName}
                          <Typography className="subheading-grey600">
                            {device.nodeUid}{" "}
                          </Typography>
                        </Typography>
                      </ListItemButton>
                    </FormLabel>
                    <FormControlLabel
                      value={device.deviceName}
                      className="radiostyle access-radio-formcontrolabel"
                      control={<Radio checked={true} />}
                      style={{ justifyContent: "space-between" }}
                      key={device.deviceName}
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
              <Tab
                className="Tab-dashboardlabel-sensor  fs-16"
                label="Phase  "
              />
              <Tab className="Tab-dashboardlabel-sensor  fs-16" label="SPD " />
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
        <DialogActions className="hgt-40" sx={{ marginBottom: "10px" }}>
          <Button
            sx={{ marginRight: "10px" }}
            className="  grey-br-button width-100 hover "
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ padding: "3px 0px" }}
            type="submit"
            className="skyblue-br-button  width-100 hover"
            onClick={() => {
              EditDevice();
              setOpen(false);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
