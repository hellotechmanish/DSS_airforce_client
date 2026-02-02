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
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PropTypes from "prop-types";
import moment from "moment";
import { HiOutlineDownload } from "react-icons/hi";

import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { FETCH_URL } from "../../../fetchIp";

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
      <Typography className="white-typo">Download Report </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white "
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
  sensor,
  vmrSensors,
  device,
  DataSets,
  GraphDate,
}) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("sm");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // SnackBar
  const [snackopen, setSnackOpen] = useState(false);
  const [snackmsg, setSnackMsg] = useState("");
  const [snackErrMsg, setSnackErrMsg] = useState();
  const [snackerropen, setSnackerropen] = useState(false);
  const [deviceSensorNumber, setdeviceSensorNumber] = useState([]);
  const [dataNumber, setdataNumber] = useState([]);

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
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const handleData = (data, datatype) => {
    if (datatype == "startDate") {
      setStartDate(moment(data).format("YYYY-MM-DD"));
    } else if (datatype == "endDate") {
      // console.log("endDate => ", moment(data).format("YYYY-MM-DD"));
      setEndDate(moment(data).format("YYYY-MM-DD"));
    }
  };
  useEffect(() => {
    if (open) {
      setStartDate(GraphDate ?? moment(new Date()).format("YYYY-MM-DD"));
    }
  }, [open]);
  // ========================================= //

  async function handleDownloadReport() {
    // console.log("==== handleDownloadReport ====");
    try {
      let body = {
        deviceId: device?._id,
        sensorName: sensor,
        deviceNumber: deviceSensorNumber,
        startDate: startDate,
        endDate: endDate,
      };
      // console.log("Body from handleDownloadReport ==>", body);
      let resp = await axios.post(
        `${FETCH_URL}/api/device/generateReport`,
        body
      );

      // console.log("resp from handleDownloadReport ==>", resp);
      if (resp.status === 200) {
        DownloadCSV();
      }
    } catch (error) {
      // console.log("error from handleDownloadReport  ==> ", error);
    }
  }

  // ============ Download CSV =========== //
  async function DownloadCSV() {
    // console.log("============= DownloadCSV () ================");
    fetch(`${FETCH_URL}/api/device/downloadcsv`, {
      method: "GET",
      headers: {
        "Content-Type": "application/csv",
      },
    })
      .then((res) => res.blob())
      .then((file) => {
        // console.log("data after the =>>", file);
        const url = window.URL.createObjectURL(
          new Blob([file], {
            type: "application/csv",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        // console.log(error);
      });
  }
  React.useEffect(() => {
    if (sensor === "RES" && device?.resSensors) {
      let arr = [];
      let dataArr = [];
      for (let i = 0; i < new Array(device?.resSensors).length; i++) {
        let str = `RES_${i}`;
        arr.push(str);
        let str2 = `R${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }

    if (sensor === "SPD" && device?.spdSensors) {
      let arr = [];
      let dataArr = [];
      for (let i = 0; i < new Array(device?.spdSensors).length; i++) {
        let str = `SPD_${i}`;
        arr.push(str);
        let str2 = `SPD${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }

    if (sensor === "NER" && device?.nerSensors) {
      let arr = [];
      let dataArr = [];
      for (let i = 0; i < new Array(device?.nerSensors).length; i++) {
        let str = `NER_${i}`;
        arr.push(str);
        let str2 = `GN${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }

    if (sensor === "VMR" && device?.vmrSensors) {
      let arr = [];
      let dataArr = [];
      for (let i = 0; i < new Array(device?.vmrSensors).length; i++) {
        let str = `${i}`;
        arr.push(str);
        let str2 = `PH${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }
    if (sensor === "TEMP" && device?.roundedTemperature) {
      let arr = [];
      let dataArr = [];
      let roundedTemperature = 1;

      for (let i = 0; i < new Array(roundedTemperature).length; i++) {
        let str = `Temp`;
        arr.push(str);
        let str2 = `T${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }
    if (sensor === "HUM" && device?.roundedTemperature) {
      let arr = [];
      let dataArr = [];
      let roundedTemperature = 1;

      for (let i = 0; i < new Array(roundedTemperature).length; i++) {
        let str = `Hum`;
        arr.push(str);
        let str2 = `H${i + 1}`;
        dataArr.push(str2);
      }
      setdeviceSensorNumber(arr);
      setdataNumber(dataArr);
    }
  }, [sensor]);

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
      <Button className="white-tr-button fs-16" onClick={handleClickOpen}>
        <HiOutlineDownload className="fs-24 mr-10" /> Download
      </Button>{" "}
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "SmallDialog",
        }}
      >
        <BootstrapDialogTitle onClose={handleClose}> </BootstrapDialogTitle>
        <DialogContent className="mt-16">
          <Grid item>
            <Typography className="input-style-typo ">
              {sensor === "VMR"
                ? `Phase Meter ${vmrSensors}`
                : `${sensor} ${dataNumber}`}
            </Typography>
          </Grid>
          <Grid container item>
            <Grid item>
              <Grid container className="mt-24">
                <Grid item xs={3}>
                  <Typography className="heading-black mt-6">
                    Select Timeline
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      className="rangepicker"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputFormat="dd/MM/yyyy"
                      value={startDate}
                      onChange={(e) => {
                        handleData(e, "startDate");
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="filled"
                          className="width100 rangepicker"
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "Start date",
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={1} xs={1} className="mt-6">
                  <Typography align="center" className="heading-black ">
                    to
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      className="rangepicker"
                      inputFormat="dd/MM/yyyy"
                      value={endDate}
                      onChange={(e) => {
                        handleData(e, "endDate");
                      }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="filled"
                          className="width100 rangepicker"
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "End date",
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            height: "35px",
          }}
        >
          <Button
            sx={{ marginRight: "10px" }}
            className="  grey-br-button width-100 hover "
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ padding: "5.2px 0px" }}
            className="skyblue-bg-button width-100 hover"
            onClick={() => {
              setOpen(false);
              handleDownloadReport();
            }}
          >
            Download
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
