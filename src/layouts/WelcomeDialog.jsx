import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import PropTypes from "prop-types";

import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
import { useNavigate } from "react-router-dom";
import general from "../assets/img/general.png";
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
      <Typography className="white-typo">Delete Site </Typography>{" "}
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
  open,
  setOpen,
  alarmStatus,
  toggleAlarmStatus,
}) {
  console.log("Check open", alarmStatus);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("xs");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "SmallDialog",
          sx: { width: "320px" },
        }}
      >
        <DialogContent>
          <Grid
            container
            style={{ justifyContent: "center", alignContent: "center" }}
          >
            <Typography align="center" className="blue-typo   mb-20 width100">
              WELCOME ADMIN!{" "}
            </Typography>{" "}
            <img src={general} alt="general" />
            <Typography align="center" className="blue-typo mt-12  width100">
              Get ready to access your <br />
              online monitoring system
            </Typography>{" "}
          </Grid>
        </DialogContent>
        <DialogActions className="hgt-40" style={{ justifyContent: "center" }}>
          <Button
            sx={{ padding: "10px 0px", width: "50%" }}
            className="skyblue-br-button  hover  mb-20"
            onClick={() => {
              setOpen(false);
              toggleAlarmStatus(alarmStatus);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
