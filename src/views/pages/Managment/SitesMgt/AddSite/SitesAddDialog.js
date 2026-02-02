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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../../fetchIp";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

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
      <Typography className="white-typo">Add Site </Typography>{" "}
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
export default function MaxWidthDialog({ getnumberOfSite }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const [siteName, setSiteName] = useState(null);
  const [uid, setUid] = useState(null);
  const [location, setLocation] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);
  const res = {};
  // SnackBar
  const [snackopen, setSnackOpen] = useState(false);
  const [snackmsg, setSnackMsg] = useState("");
  const [snackErrMsg, setSnackErrMsg] = useState();
  const [snackerropen, setSnackerropen] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
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

  const handleClose = () => {
    setOpen(false);
    setSiteName("");
    setUid("");
    setLocation("");
    setPincode("");
    setCountry("");
    register("");
  };
  const CraeteSite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/site/createSite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteName: siteName,
          uid: uid,
          location: location,
          pincode: pincode,
          country: country,
          state: state,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setOpen(false);
        setSnackOpen(true);
        setSnackMsg(res.msg);
        getnumberOfSite();
        handleClose();
      } else {
        setSnackerropen(true);
        setOpen(false);
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  const [uidMatch, setUidMatch] = useState(true);
  const CheckSiteUid = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/site/checkSiteUid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: uid,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        // // console.log("Check Uid Match Status", res.msg);
        setUidMatch(res.status);
      } else {
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  useEffect(() => {
    CheckSiteUid(uid);
  }, [uid]);
  useEffect(() => {
    if (res) {
      setSiteName("");
      setUid("");
      setLocation("");
      setPincode("");
      setCountry("");
      register("");
    }
  }, []);

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
      <Button
        sx={{ width: "100px" }}
        className=" skyblue-bg-button fs-16  hover"
        onClick={handleClickOpen}
      >
        Add Site
      </Button>
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
        ></BootstrapDialogTitle>
        <form onSubmit={handleSubmit(CraeteSite)}>
          <DialogContent className="mt-16">
            <Grid container justifyContent="space-between">
              <Grid item md={5.8}>
                <Typography className="heading-black mt-16">
                  Site Name
                </Typography>
                <Input
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  value={siteName}
                  {...register("Site-Name-ErrorInput", {
                    required: "Site  Name is required.",
                    onChange: (e) => {
                      setSiteName(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Site-Name-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-16">UID</Typography>
                <Input
                  className="input-style-1c mt-12 width100"
                  disableUnderline
                  value={uid}
                  {...register("Uid-ErrorInput", {
                    required: "UID  is required.",
                    onChange: (e) => {
                      setUid(e.target.value);
                    },
                  })}
                />
                <Typography>
                  {uidMatch === false ? (
                    <Typography className="red-typo">
                      Uid Already Exist !
                    </Typography>
                  ) : null}
                </Typography>
                <ErrorMessage
                  errors={errors}
                  name="Uid-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-12">
                  Location
                </Typography>
                <Input
                  // required={true}
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  value={location}
                  {...register("Location-ErrorInput", {
                    required: "Location  is required.",
                    onChange: (e) => {
                      setLocation(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Location-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-12">Pincode</Typography>
                <Input
                  className="input-style-1c mt-12 width100"
                  disableUnderline
                  value={pincode}
                  minlength="4"
                  maxlength="8"
                  type="number"
                  {...register("Pincode-ErrorInput", {
                    required: "Pincode  is required.",
                    onChange: (e) => {
                      setPincode(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Pincode-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-12">State</Typography>
                <Input
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  value={state}
                  {...register("State-ErrorInput", {
                    required: "State  is required.",
                    onChange: (e) => {
                      setState(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="State-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-12">Country</Typography>
                <Input
                  className="input-style-1c mt-12 width100"
                  disableUnderline
                  value={country}
                  {...register("Country-ErrorInput", {
                    required: "Country  is required.",
                    onChange: (e) => {
                      setCountry(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Country-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ marginBottom: "10px" }}>
            <Button
              sx={{ marginRight: "10px" }}
              className="  grey-br-button width-100 "
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{ padding: "3px 0px" }}
              className="skyblue-br-button width-100"
              type="submit"
              // onClick={() => {
              //   CraeteSite();
              //   setOpen(false);
              // }}
            >
              Submit
            </Button>
          </DialogActions>{" "}
        </form>
      </BootstrapDialog>
    </React.Fragment>
  );
}
