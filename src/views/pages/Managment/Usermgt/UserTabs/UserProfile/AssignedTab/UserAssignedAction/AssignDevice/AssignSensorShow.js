import React, { useState, useEffect } from "react";
import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Input,
  TextField,
  FormLabel,
  Box,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { FETCH_URL } from "../../../../../../../../../fetchIp";
//React Icons

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
      <Typography className="white-typo">Assigned Sensors </Typography>{" "}
      {children}
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon />
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
export default function MaxWidthDialog({ user, sensorValue }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseProfile = () => {
    setOpen(false);
  };
  const [value, setValue] = React.useState(0);
  const TabChange = (event, newValue) => {
    setValue(newValue);
  };

  const [getSelectSensor, setGetSelectSensor] = useState(null);

  // ========================== Get Assign sensor ================================ //
  const getAssignSensorData = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/getassignSensor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          deviceId: sensorValue?._id,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        console.log(
          "Check Res EditDevice Data from assignSensorSHow",
          res.msg[0]
        );
        setGetSelectSensor(res.msg[0]);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };

  React.useEffect(() => {
    getAssignSensorData();
  }, []);

  return (
    <React.Fragment>
      <span className="sky-typo hover" onClick={handleClickOpen}>
        view
      </span>
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleCloseProfile}
        PaperProps={{
          className: "SmallDialog",
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseProfile}
        ></BootstrapDialogTitle>
        <DialogContent className="mt-16">
          <Box className="tab-user-box mt-24">
            <Tabs
              value={value}
              onChange={TabChange}
              className="Tabs-dashboard2"
              style={{ padding: "0px 10px" }}
            >
              <Tab
                className="Tab-dashboardlabel-sensor fs-16"
                label="Resistance "
              />
              <Tab className="Tab-dashboardlabel-sensor fs-16" label="GN " />
              <Tab
                className="Tab-dashboardlabel-sensor fs-16"
                label="Phase  "
              />
              <Tab className="Tab-dashboardlabel-sensor fs-16" label="SPD " />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid container direction="row">
              <Grid container className="widthLR-90 ">
                {getSelectSensor?.resistanceNumber?.length > 0 ? (
                  getSelectSensor?.resistanceNumber?.map((item, i) => {
                    return (
                      <>
                        <FormControlLabel
                          style={{
                            width: "90px",
                          }}
                          className="billboard-screencheckbox  mt-16"
                          value={item?.deviceNumber}
                          control={
                            <Checkbox className="icons-blue" checked={true} />
                          }
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
                  })
                ) : (
                  <Typography className="mt-16 subheading-grey600">
                    No assigned sensor
                  </Typography>
                )}
              </Grid>
            </Grid>{" "}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container direction="row">
              <Grid container className="widthLR-90 ">
                {getSelectSensor?.gnNumber?.length > 0 ? (
                  getSelectSensor?.gnNumber?.map((item, i) => {
                    return (
                      <>
                        <Grid>
                          <FormControlLabel
                            style={{
                              width: "90px",
                            }}
                            className="billboard-screencheckbox  mt-16"
                            control={
                              <Checkbox className="icons-blue" checked={true} />
                            }
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
                  })
                ) : (
                  <Typography className="mt-16 subheading-grey600">
                    No assigned sensor
                  </Typography>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid container direction="row">
              <Grid container className="widthLR-90 ">
                {getSelectSensor?.phaseNumber?.length > 0 ? (
                  getSelectSensor?.phaseNumber?.map((item, i) => {
                    return (
                      <>
                        <Grid>
                          <FormControlLabel
                            style={{
                              width: "160px",
                            }}
                            className="billboard-screencheckbox  mt-16"
                            control={
                              <Checkbox className="icons-blue" checked={true} />
                            }
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
                  })
                ) : (
                  <Typography className="mt-16">No assigned sensor</Typography>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Grid container direction="row">
              <Grid container className="widthLR-90 ">
                <Grid item>
                  {getSelectSensor?.spdNumber?.length > 0 ? (
                    getSelectSensor?.spdNumber?.map((item, i) => {
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
                                  checked={true}
                                />
                              }
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
                    })
                  ) : (
                    <Typography className="mt-16">
                      No assigned sensor
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>{" "}
          </TabPanel>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
