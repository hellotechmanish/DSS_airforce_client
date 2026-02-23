import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import PropTypes from "prop-types";
import { POST } from "../../../lib/request";
import { API } from "../../../lib/endpoint";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
import { RiDeleteBin6Line } from "react-icons/ri";

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
    <DialogTitle className="dialog-title" sx={{ m: 0, p: 1.2 }} {...other}>
      {children}
      <Typography className="white-typo">Delete Alarm </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "red",
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
export default function MaxWidthDialog({ alarmID, getnumberOfAlarm }) {
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

  const DeleteAlarm = async () => {
    try {
      const res = await POST(API.ALARM.DELETE, {
        alarmId: alarmID,
      });

      setSnackOpen(true);
      setSnackMsg(res.msg);
      setOpen(false);
      getnumberOfAlarm();
    } catch (err) {
      setSnackerropen(true);
      setSnackErrMsg(err?.msg || "Failed to delete alarm");
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
        <IconButton className="mt-5px icons-blue" onClick={handleClickOpen}>
          <RiDeleteBin6Line />
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
          <Typography className="greycolor505050500">
            Are you sure you want to Delete this Alarm?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ marginRight: "10px" }}
            className="  grey-br-button width-100 "
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            sx={{ padding: "3px 0px" }}
            className="red-br-button width-100"
            onClick={() => {
              DeleteAlarm();
              setOpen(false);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
