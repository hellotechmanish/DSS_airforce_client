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

import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { RiDeleteBin6Line } from "react-icons/ri";
import { API } from "../../../../../lib/endpoint";
import { POST } from "../../../../../lib/request";

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
      <Typography className="white-typo">Delete Site </Typography>{" "}
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
export default function MaxWidthDialog({ sitesID, getnumberOfSite }) {
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

  const deleteUser = async () => {
    try {
      const body = {
        siteId: sitesID,
      };

      const res = await POST(API.SITE.DELETE, body);

      if (res) {
        setSnackOpen(true);
        setSnackMsg(res?.msg || "Site deleted successfully");

        setOpen(false);
        getnumberOfSite();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res?.err || "Failed to delete site");
      }
    } catch (error) {
      console.error("deleteSite error:", error);

      setSnackerropen(true);
      setSnackErrMsg(error?.msg || "Failed to delete site");
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
            Are you sure you want to Delete this User?
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
              deleteUser();
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
