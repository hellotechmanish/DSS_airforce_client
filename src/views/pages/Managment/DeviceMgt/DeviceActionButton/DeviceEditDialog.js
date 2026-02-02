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

import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../fetchIp";

import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
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
      <Typography className="white-typo">Edit Site </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#000000,",
          }}
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
export default function MaxWidthDialog({ row, getnumberOfSite, sitesID }) {
  // // console.log("Check Sites Data in Add device Dialog", row);

  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [siteName, setSiteName] = useState(null);
  const [uid, setUid] = useState(null);
  const [location, setLocation] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);

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

  useEffect(() => {
    if (row) {
      setSiteName(row.siteName);
      setUid(row.uid ?? "");
      setLocation(row.location);
      setPincode(row.pincode ?? "");
      setCountry(row.country ?? "");
    }
  }, [row]);
  const EditSite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/site/editSite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: sitesID,
          siteName: siteName,
          uid: uid,
          location: location,
          pincode: pincode,
          country: country,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setSnackOpen(true);
        setSnackMsg(res.msg);
        setOpen(false);
        getnumberOfSite();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };

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
      <Tooltip title="Delete" className="tooltipheight">
        <IconButton className="mt-5px" onClick={handleClickOpen}>
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
        <BootstrapDialogTitle> </BootstrapDialogTitle>
        <DialogContent className="mt-16">
          <Grid container justifyContent="space-between">
            <Grid item md={5.8}>
              <Typography className="heading-black mt-16">Site Name</Typography>
              <Input
                className=" input-style-1c mt-12 width100"
                disableUnderline
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-16">UID</Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">Location</Typography>
              <Input
                className=" input-style-1c mt-12 width100"
                disableUnderline
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">Pincode</Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">State</Typography>
              <Input
                className=" input-style-1c mt-12 width100"
                disableUnderline
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">Country</Typography>
              <Input
                className="input-style-1c mt-12 width100"
                disableUnderline
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Grid>
          </Grid>
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
            className="skyblue-br-button width-100 hover"
            onClick={() => {
              EditSite();
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
