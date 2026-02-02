import React, { useState, useEffect } from "react";
import {
  Button,
  Step,
  Stepper,
  Box,
  StepLabel,
  Grid,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
//core components that
import MuiAlert from "@mui/material/Alert";

import AssignDevice from "./DeviceShow";
import AssignSensors from "./DeviceSensor";
import { FETCH_URL } from "../../../../../../../../../fetchIp";

const steps = ["Select Device", "Select Sensors"];
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Clusterhead({
  deviceID,
  UserId,
  getnumberOfUser,
  setOpen,
  state,
  siteId,
  selectUid,
  getdevicebyuserId,
}) {
  // // console.log("Check Site Id ", siteId);
  const [activeStep, setActiveStep] = React.useState(0);

  // For Third Step
  const [sitesDeviceData, setSitesDeviceData] = useState(null);
  const [originalDeviceData, setOriginalDeviceData] = React.useState(null);
  const [siteDeviceUid, setDeviceSitesUid] = useState(null);
  const handleChangeDevice = (e, data) => {
    // // console.log("select device handle chanbge ==> ", e.target.value);
    setOriginalDeviceData(data._id);
    setSitesDeviceData(data.deviceName);
    setDeviceSitesUid(data.nodeUid);
  };
  // For Last Step
  const [resValue, setResValue] = React.useState([]);
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
  const [spdNumber, setSpdNumber] = useState([]);
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

  const [gnNumber, setGnNumber] = useState([]);
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

  const [phaseNumber, setPhaseNumber] = useState([]);

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

  // State For Validation

  // For Third Step
  const [sitesDeviceDataErr, setSitesDeviceDataErr] = useState(null);
  // For Last Step

  const [device, setDevice] = useState(null);

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
  // Function Calling

  const handleNext = () => {
    // // console.log("activestep ===> ", activeStep);
    // if (activeStep === 0) {
    //   if (fullName && uid) {
    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //   }
    // }
    if (activeStep === 0) {
      if (sitesDeviceData) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      // if (!originalDeviceData) {
      //   setSitesDeviceDataErr(true);
      // }
      AssingDevice();
    }
  };

  useEffect(() => {
    if (originalDeviceData) {
      setSitesDeviceDataErr(false);
    }
  }, [originalDeviceData]);
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //===============================  ALL Form Elements here ================================//
  function _renderStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AssignDevice
            handleChangeDevice={handleChangeDevice}
            states={{
              device,
              sitesDeviceDataErr,
              state,
              selectUid,
            }}
          />
        );
      case 1:
        return (
          <AssignSensors
            states={{
              originalDeviceData,
              sitesDeviceData,
              siteDeviceUid,
              device,
              resValue,
              spdNumber,
              gnNumber,
              phaseNumber,
              state,
              sitesDeviceData,
              siteDeviceUid,
              selectUid,
            }}
            storeResValue={storeResValue}
            storeSpdValue={storeSpdValue}
            storeGnValue={storeGnValue}
            storePhaseValue={storePhaseValue}
          />
        );
    }
  }
  useEffect(() => {
    getdeviceListbysite();
  }, []);

  const getdeviceListbysite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/device/getdeviceListbysiteId/${siteId}`,
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
      // // console.log(" get device List by site Id resp ===> ", res.msg);
      setDevice(res.msg);
    } else {
      // console.log("Error in get device List by site Id ==> ", res);
    }
  };

  const AssingDevice = async () => {
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
          deviceId: originalDeviceData,
          resistanceNumber: resValue,
          spdNumber: spdNumber,
          gnNumber: gnNumber,
          phaseNumber: phaseNumber,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setSnackOpen(true);
        setSnackMsg(res.msg);
        getdevicebyuserId();
        setOpen(false);
      } else {
        // console.log("Else block ====>");
        setSnackerropen(true);
        setSnackErrMsg(res.err);
        setOpen(false);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  return (
    <>
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
      <Box className="width100">
        <div className="flex-class">
          <div className="width100">
            <Stepper
              sx={{ marginLeft: "70px" }}
              activeStep={activeStep}
              alternativeLabel
              className=" stepper "
            >
              {steps.map((data, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={data} {...stepProps}>
                    <StepLabel className="step" {...labelProps}>
                      {data}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>{" "}
          </div>
        </div>
        {/* ====================== Rendering of element ========================= */}
        <div style={{ minHeight: "460px", maxHeight: "500px" }}>
          {_renderStepContent(activeStep)}{" "}
        </div>
        <DialogActions style={{ padding: "0px", margin: "0px" }}>
          <React.Fragment>
            <Box className="stepmain-box ">
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                className="mt-32 mb-10 mr-10"
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 4 }}
                  className={activeStep ? "grey-br-button " : null}
                >
                  Previous
                </Button>

                {activeStep == 1 ? null : (
                  <Button
                    onClick={handleNext}
                    // className="purplebtn"
                    // className={activeStep ? "purplebtn " : null}
                    className={
                      activeStep === steps.length - 1
                        ? null
                        : "skyblue-br-button width-100 mr-10 "
                    }
                  >
                    {/* {activeStep === steps.length - 1 ? null : "Next"} */}
                    {activeStep == 1 ? null : "next"}
                  </Button>
                )}

                {activeStep == 1 && (
                  <Button
                    onClick={handleNext}
                    className={
                      activeStep === steps.length - 1
                        ? "skyblue-bg-button mr-10 width-100"
                        : null
                    }
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </Box>
          </React.Fragment>{" "}
        </DialogActions>
      </Box>
    </>
  );
}
