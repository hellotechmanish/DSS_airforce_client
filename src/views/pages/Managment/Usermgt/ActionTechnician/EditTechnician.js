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
import { CiEdit } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../../fetchIp";
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
    <DialogTitle className="dialog-title-add" sx={{ m: 0, p: 1.2 }} {...other}>
      {children}
      <Typography className="white-typo">Edit Technician </Typography>{" "}
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
export default function MaxWidthDialog({ techID, row, getnumberOftechnician }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [fullName, setFullName] = useState(null);
  const [uid, setUid] = useState(null);
  const [type, setType] = useState(null);
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

  const EditTechnician = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/user/editUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName,
          uid: uid,
          userRole: 1,
          userId: techID,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        setSnackOpen(true);
        setSnackMsg(res.msg);
        setOpen(false);
        getnumberOftechnician();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res.err);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  useEffect(() => {
    if (row) {
      setFullName(row.fullName);
      setUid(row.uid ?? "");
    }
  }, [row]);
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
      <Tooltip title="Edit" className="tooltipheight">
        <IconButton className="mt-5px icons-blue" onClick={handleClickOpen}>
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
        <form onSubmit={handleSubmit(EditTechnician)}>
          <DialogContent className="mt-16">
            <Grid container justifyContent="space-between">
              <Grid item md={5.8}>
                <Typography className="heading-black mt-16">
                  Full Name
                </Typography>
                <Input
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  value={fullName}
                  {...register("Full-Name-ErrorInput", {
                    required: "Full Name is required.",
                    onChange: (e) => {
                      setFullName(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Full-Name-ErrorInput"
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
                  {...register("UID-ErrorInput", {
                    required: "UID  is required.",
                    onChange: (e) => {
                      setUid(e.target.value);
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="UID-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
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
              sx={{ padding: "5px 0px" }}
              type="submit"
              className="skyblue-br-button hover"
              // onClick={() => {
              //   EditTechnician();
              //   setOpen(false);
              // }}
            >
              Update
            </Button>
          </DialogActions>{" "}
        </form>
      </BootstrapDialog>
    </React.Fragment>
  );
}
