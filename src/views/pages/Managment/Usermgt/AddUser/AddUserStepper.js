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

import PersonalInfo from "./StepCompo/PersonalInfo";
import AssignSite from "./StepCompo/AssignSite";
import AssignDevice from "./StepCompo/AssignDevice";
import AssignSensors from "./StepCompo/AssignSensors";
import { FETCH_URL } from "../../../../../fetchIp";

const steps = [
  "Personal Info",
  "Assign Site",
  "Assign Device",
  "Assign Sensors",
];
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Clusterhead({ open, setOpen, getnumberOfUser }) {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [show, setShow] = useState(false);
  //For First Step
  const [fullName, setFullName] = useState(null);
  const [uid, setUid] = useState(null);
  const [passwordValue, setPasswordValue] = useState(null);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState(null);
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const newPassword = passwordInput.confirmPassword;
  //For Second Step
  const [sitesData, setSiteData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [siteUid, setSitesUid] = useState();

  // const handleChangeSite = (e, data, i) => {
  //   setOriginalData(e.target.value);
  //   setSiteData(data.siteName);
  //   setSitesUid(data.uid);
  // };

  // console.log("Check originalData", originalData);

  function handleChangeSite(e, data, i) {
    let storeArr = originalData;
    if (e.target.value) {
      storeArr = data._id;
    } else {
      storeArr = null;
    }
    // console.log(storeArr);
    setOriginalData(storeArr);
    setSiteData(data.siteName);
    setSitesUid(data.uid);
  }

  // For Third Step
  const [sitesDeviceData, setSitesDeviceData] = useState(null);
  const [originalDeviceData, setOriginalDeviceData] = React.useState(null);
  const [siteDeviceUid, setDeviceSitesUid] = useState(null);
  // // console.log("Check originalDeviceData", originalDeviceData);
  const handleChangeDevice = (e, data, i) => {
    setOriginalDeviceData(e.target.value);
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
  function storeSpdValue(e, item, i) {
    let storeArr = [...spdNumber];
    let Element = storeArr.findIndex((item) => item === item);
    if (Element >= 0) {
      storeArr.splice(Element, 1);
    } else {
      storeArr.push(item);
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
  //For First Step Error Handle
  const [fullNameErr, setFullNameErr] = useState(false);
  const [uidErr, setUidErr] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmpassValid, setConfirmPassValid] = useState(false);
  const [passErr, setPassErr] = useState(false);
  // For PassWord Extra Validation
  const [passwordError, setPasswordErr] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [permissions, setPermissions] = useState([]); //===> For access permissions array
  //For Second Step
  const [sitesDataErr, setSiteDataErr] = useState(false);
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
  const handlePasswordChange = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {
      ...passwordInput,
      [passwordInputFieldName]: passwordInputValue,
    };
    setPasswordInput(NewPasswordInput);
  };

  const handleValidation = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;

    //for password
    if (passwordInputFieldName === "password") {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-8])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{6,}/;
      const passwordLength = passwordInputValue.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const specialCharPassword = specialCharRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);
      let errMsg = "";
      if (passwordLength === 0) {
        errMsg = "Password can not  empty";
      } else if (!uppercasePassword) {
        errMsg = "At least one Uppercase";
      } else if (!lowercasePassword) {
        errMsg = "At least one Lowercase";
      } else if (!digitsPassword) {
        errMsg = "At least one digit";
      } else if (!specialCharPassword) {
        errMsg = "At least one Special Characters";
      } else if (!minLengthPassword) {
        errMsg = "At least minumum 6 characters";
      } else {
        errMsg = "";
      }
      setPasswordErr(errMsg);
    }
    // for confirm password
    if (
      passwordInputFieldName === "confirmPassword" ||
      (passwordInputFieldName === "password" &&
        passwordInput.confirmPassword.length > 0)
    ) {
      if (passwordInput.confirmPassword !== passwordInput.password) {
        setConfirmPasswordError("Confirm password is not matched");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-8])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{6,}/;
      if (!fullName) {
        setFullNameErr(true);
      }
      if (!uid) {
        setUidErr(true);
      }
      if (!passwordInput?.password) {
        setPasswordValid(true);
        uppercaseRegExp.test(passwordInput?.password);
        lowercaseRegExp.test(passwordInput?.password);
        digitsRegExp.test(passwordInput?.password);
        specialCharRegExp.test(passwordInput?.password);
        minLengthRegExp.test(passwordInput?.password);
      }
      if (!passwordInput?.confirmPassword) {
        setConfirmPassValid(true);
      }
      if (!sitesData) {
        setSiteDataErr(true);
      }
      if (
        fullName &&
        uid &&
        passwordInput?.password &&
        passwordInput?.confirmPassword &&
        passwordInput?.password === passwordInput.confirmPassword &&
        uppercaseRegExp.test(passwordInput?.password) &&
        lowercaseRegExp.test(passwordInput?.password) &&
        digitsRegExp.test(passwordInput?.password) &&
        specialCharRegExp.test(passwordInput?.password) &&
        minLengthRegExp.test(passwordInput?.password)
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      if (originalData.length > 0) {
        if (sitesData) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      }
    } else if (activeStep === 2) {
      if (!originalDeviceData) {
        setSitesDeviceDataErr(true);
      }
      if (originalDeviceData) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      if (activeStep == 3) {
        // console.log("Active Step is 4");
        CraeteUser();
        // setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    }
  };
  useEffect(() => {
    if (fullName) {
      setFullNameErr(false);
    }
    if (uid) {
      setUidErr(false);
    }
    if (passwordInput?.password) {
      setPasswordValid(false);
    }
    if (passwordInput?.confirmPassword) {
      setConfirmPassValid(false);
    }
    if (sitesData) {
      setSiteDataErr(false);
    }
    if (originalDeviceData) {
      setSitesDeviceDataErr(false);
    }
    if (passwordInput) {
      setSitesDeviceDataErr(false);
    }
  }, [
    fullName,
    uid,
    passwordInput?.password,
    passwordInput?.confirmPassword,
    sitesData,
    originalDeviceData,
    passwordInput,
  ]);
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //===============================  ALL Form Elements here ================================//
  function _renderStepContent(step) {
    switch (step) {
      case 0:
        return (
          <PersonalInfo
            handleValidation={handleValidation}
            handlePasswordChange={handlePasswordChange}
            states={{
              open,
              show,
              setShow,
              uid,
              setUid,
              fullName,
              setFullName,
              confirmPasswordValue,
              passwordValue,
              confirmPasswordError,
              passwordError,
              fullNameErr,
              uidErr,
              passwordValid,
              confirmpassValid,
              passwordInput,
            }}
          />
        );
      case 1:
        return (
          <AssignSite
            states={{
              sitesDataErr,
              originalData,
              setOriginalData,
              sites,
              setSites,
            }}
            handleChangeSite={handleChangeSite}
          />
        );
      case 2:
        return (
          <AssignDevice
            handleChangeDevice={handleChangeDevice}
            states={{
              originalData,
              sitesData,
              siteUid,
              device,
              sitesDeviceDataErr,
              originalDeviceData,
            }}
          />
        );
      case 3:
        return (
          <AssignSensors
            states={{
              originalDeviceData,
              sitesDeviceData,
              siteDeviceUid,
              originalData,
              sitesData,
              siteUid,
              device,
              resValue,
              spdNumber,
              gnNumber,
              phaseNumber,
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
    getdeviceListbysite(originalData);
  }, [originalData]);

  const getdeviceListbysite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/device/getdeviceListbysiteId/${originalData}`,
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
  const [sites, setSites] = useState(null);

  const getnumberOfSite = async () => {
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
      console.log(" get site List resp ===> ", res.msg);
      setSites(res.msg);
    } else {
      // console.log("Error in get site List ==> ", res);
    }
  };
  useEffect(() => {
    getnumberOfSite();
  }, []);

  const CraeteUser = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newPassword,
          fullName: fullName,
          uid: uid,
          type: "user",
          siteId: originalData,
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
        setOpen(false);
        getnumberOfUser();
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
        <div style={{ minHeight: "380px", maxHeight: "auto" }}>
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
                  className={activeStep ? "grey-br-button  hover" : null}
                >
                  Previous
                </Button>

                {activeStep == 3 ? null : (
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
                    {activeStep == 3 ? null : "next"}
                  </Button>
                )}

                {activeStep == 3 && (
                  <Button
                    onClick={handleNext}
                    className={
                      activeStep === steps.length - 1
                        ? "skyblue-bg-button mr-10 width-100 hover"
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
        {/* <SuccessDialog
          openData={openDialogName === "success"}
          data={"User Added"}
          handleClose={handleClose}
        />
        <WrongDialog
          openData={openDialogName === "reject"}
          data={"Error: Something went wrong !"}
        /> */}
      </Box>
    </>
  );
}
