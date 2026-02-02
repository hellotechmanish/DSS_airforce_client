import React, { useState, useEffect } from "react";
import {
  Grid,
  Backdrop,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
  Tooltip,
  Snackbar,
  Input,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../../fetchIp";
import DeleteDevice from "../ActionButton/DeleteDevice";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
import { RiDeleteBin6Line } from "react-icons/ri";
import { AuthContext } from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../api/axiosInstance";

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
export default function MaxWidthDialog({
  sensorValue,
  deviceID2,
  getdeviceListbysite,
  getnumberOfDevice,
}) {
  const [open, setOpen] = React.useState(false);

  const auth = React.useContext(AuthContext);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("lg");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseProfile = () => {
    setOpen(false);
  };
  const [singledeviceData, setSingleDeviceData] = useState(null);
  const [inputState, setInputState] = useState(true);
  const [deviceName, setDeviceName] = useState(null);
  const [nodeUid, setNodeUid] = useState(null);
  const [vmrSensors, setVmrSensors] = useState(null);
  const [resSensors, setResSensors] = useState(null);
  const [spdSensors, setSpdSensors] = useState(null);
  const [nerSensors, setNerSensors] = useState(null);
  const [resSensorsThreshold, setResSensorsThreshold] = useState(null);
  const [spdSensorsThreshold, setSpdSensorsThreshold] = useState(null);
  const [nerSensorsThreshold, setNerSensorsThreshold] = useState(null);

  function ChangeInputState() {
    setInputState(false);
  }

  function ChangeInputCancel(e) {
    setInputState(true);
  }

  const [vmrSensorsThreshold, setVmrSensorsThreshold] = useState({
    r: "",
    y: " ",
    b: "",
    ry: "",
    yb: "",
    rb: "",
  });
  // // console.log("Cehck vmrSensorsThreshold ", vmrSensorsThreshold);
  const handleChangesetR = (event) => {
    setVmrSensorsThreshold((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }; // SnackBar
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
  const getSingleDeviceData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/device/getDeviceDataById/${deviceID2}`
      );
      setSingleDeviceData(response.data.msg);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const EditDeviceProfile = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/device/editDevice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceID: sensorValue._id,
          deviceName: deviceName,
          nodeUid: nodeUid,
          vmrSensors: +vmrSensors,
          resSensors: +resSensors,
          spdSensors: +spdSensors,
          nerSensors: +nerSensors,
          vmrSensorsThreshold: vmrSensorsThreshold,
          resSensorsThreshold: +resSensorsThreshold,
          spdSensorsThreshold: +spdSensorsThreshold,
          nerSensorsThreshold: +nerSensorsThreshold,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setSnackOpen(true);
        setSnackMsg(res.msg);
        getdeviceListbysite();
        getnumberOfDevice(deviceID2);
        setOpen(false);
        setInputState(true);
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  useEffect(() => {
    if (deviceID2) {
      getSingleDeviceData();
    }
  }, [deviceID2]);
  useEffect(() => {
    if (singledeviceData) {
      setDeviceName(singledeviceData?.deviceName);
      setVmrSensors(singledeviceData?.vmrSensors);
      setNodeUid(singledeviceData?.nodeUid);
      setVmrSensorsThreshold(singledeviceData?.vmrSensorsThreshold);
      setResSensors(singledeviceData?.resSensors);
      setResSensorsThreshold(singledeviceData?.resSensorsThreshold);
      setSpdSensors(singledeviceData?.spdSensors);
      setSpdSensorsThreshold(singledeviceData?.spdSensorsThreshold);
      setNerSensors(singledeviceData?.nerSensors);
      setNerSensorsThreshold(singledeviceData?.nerSensorsThreshold);
    }
  }, [singledeviceData]);
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

      <span onClick={handleClickOpen} className="hover-sky">
        {" "}
        (View profile){" "}
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
        >
          {inputState ? (
            <Typography className="white-typo">Device Profile</Typography>
          ) : (
            <Typography className="white-typo"> Edit Profile</Typography>
          )}
        </BootstrapDialogTitle>
        <DialogContent className="mt-16" sx={{ marginBottom: "20px " }}>
          <Grid container justifyContent="space-between">
            <Grid item md={5.8}>
              <Typography className="heading-black mt-16">Site Name</Typography>
              <Input
                className=" input-style-1c mt-12 width100"
                disableUnderline
                value={sensorValue?.siteId?.siteName}
                disabled
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-16">Site UID</Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                value={sensorValue?.siteId?.uid}
                disabled
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                Device Name
              </Typography>
              <Input
                className=" input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">Node UID</Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={nodeUid}
                onChange={(e) => setNodeUid(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                Phase Sensors
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                type="Number"
                disabled={inputState}
                value={vmrSensors}
                onChange={(e) => setVmrSensors(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                Phase Sensor Threshold{" "}
              </Typography>
              <Grid container justifyContent="space-between">
                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="R"
                    name="r"
                    disabled={inputState}
                    value={vmrSensorsThreshold?.r}
                    onChange={handleChangesetR}
                  />
                </Grid>

                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="Y"
                    name="y"
                    disabled={inputState}
                    value={vmrSensorsThreshold?.y}
                    onChange={handleChangesetR}
                  />
                </Grid>
                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="B"
                    name="b"
                    disabled={inputState}
                    onChange={handleChangesetR}
                    value={vmrSensorsThreshold?.b}
                  />
                </Grid>
                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="RY"
                    name="ry"
                    disabled={inputState}
                    onChange={handleChangesetR}
                    value={vmrSensorsThreshold?.ry}
                  />
                </Grid>

                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="YB"
                    name="yb"
                    disabled={inputState}
                    onChange={handleChangesetR}
                    value={vmrSensorsThreshold?.yb}
                  />
                </Grid>
                <Grid item md={1.8}>
                  <TextField
                    className=" mt-4 width100 text-field-style"
                    id="outlined-basic"
                    type="number"
                    label="RB"
                    name="rb"
                    disabled={inputState}
                    onChange={handleChangesetR}
                    value={vmrSensorsThreshold?.rb}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                SPD Sesnors
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={spdSensors}
                onChange={(e) => setSpdSensors(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                SPD Sensor Threshold
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={spdSensorsThreshold}
                onChange={(e) => setSpdSensorsThreshold(e.target.value)}
              />
            </Grid>

            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                RES Sensors
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={resSensors}
                onChange={(e) => setResSensors(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                RES Sensor Threshold
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={resSensorsThreshold}
                onChange={(e) => setResSensorsThreshold(e.target.value)}
              />
            </Grid>

            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                GN Sensors
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={nerSensors}
                onChange={(e) => setNerSensors(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                GN Sensor Threshold
              </Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                disabled={inputState}
                value={nerSensorsThreshold}
                onChange={(e) => setNerSensorsThreshold(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {auth.user.role === 2 || auth.user.role === 1 ? null : (
          <DialogActions sx={{ marginBottom: "10px" }}>
            <Grid
              container
              justifyContent="space-between"
              sx={{ padding: "0px 8px " }}
            >
              <Grid item>
                <DeleteDevice
                  sensorValue={sensorValue}
                  handleCloseProfile={handleCloseProfile}
                />
              </Grid>
              <Grid item>
                {inputState ? (
                  <>
                    <Button
                      className="skyblue-br-button width-150 hover "
                      onClick={() => ChangeInputState()}
                    >
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="  grey-br-button width-150 mr-10  hover"
                      onClick={() => ChangeInputCancel()}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="skyblue-bg-button width-150 hover"
                      onClick={() => EditDeviceProfile()}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </BootstrapDialog>
    </React.Fragment>
  );
}
