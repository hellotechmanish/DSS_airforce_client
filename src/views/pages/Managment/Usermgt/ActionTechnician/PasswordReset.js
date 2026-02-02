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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import PropTypes from "prop-types";
import { FETCH_URL } from "../../../../../fetchIp";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
//React Icons
import { RiLockPasswordLine } from "react-icons/ri";

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
      <Typography className="white-typo">
        {" "}
        Reset Technician Password{" "}
      </Typography>
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
export default function MaxWidthDialog({ techID, getnumberOftechnician }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
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
  const [show, setShow] = useState(false);
  const [showconfrim, setShowConfrim] = useState(false);

  const [passwordValue, setPasswordValue] = useState(null);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState(null);
  const [passwordError, setPasswordErr] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
  });

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
  const newPassword = passwordInput.confirmPassword;

  const CraeteTechnician = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    if (
      passwordInput.password.length === 0 &&
      passwordInput.confirmPassword.length === 0
    ) {
      setPasswordErr("Password is required");
      setConfirmPasswordError(" Confirm password is required");
      return;
    }
    if (passwordInput.confirmPassword !== passwordInput.password) {
      setConfirmPasswordError("Confirm password is not matched");
      return;
    }
    if (passwordInput.confirmPassword.length < 8) {
      setConfirmPasswordError("At least minumum 8 characters");
      return;
    }
    if (passwordInput.confirmPassword.length < 8) {
      setConfirmPasswordError("At least minumum 8 characters");
      return;
    }
    try {
      const response = await fetch(`${FETCH_URL}/api/user/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: techID,
          password: newPassword,
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
  const handleClose = () => {
    setOpen(false);
    setShow(false);
    setShowConfrim(false);
    setPasswordInput({ password: "", confirmPassword: "" });
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
      <Tooltip title="Password" className="tooltipheight">
        <IconButton className="mt-5px icons-blue" onClick={handleClickOpen}>
          <RiLockPasswordLine />
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
        <BootstrapDialogTitle onClose={handleClose}> </BootstrapDialogTitle>
        <DialogContent className="mt-16">
          <Grid container justifyContent="space-between">
            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                New Password
              </Typography>
              <Grid sx={{ position: "relative" }}>
                <Input
                  className=" input-style-1c mt-12 width100"
                  type={show ? "text" : "password"}
                  // type="password"
                  disableUnderline
                  //   onChange={passwordChange}
                  // {...register("singleErrorInput", {
                  //   required: "This is required.",
                  // })}
                  value={passwordValue}
                  onChange={handlePasswordChange}
                  onKeyUp={handleValidation}
                  name="password"
                />
                <Typography
                  sx={{ position: "absolute", top: 18, right: 5 }}
                  align="right"
                  className="fs-24 cursor-point "
                  onClick={() => setShow(!show)}
                >
                  {show ? (
                    <AiOutlineEye color="grey" />
                  ) : (
                    <AiOutlineEyeInvisible color="grey" />
                  )}
                </Typography>
                <Typography className="red-typo">{passwordError}</Typography>{" "}
              </Grid>
            </Grid>

            <Grid item md={5.8}>
              <Typography className="heading-black mt-12">
                Confirm password
              </Typography>
              <Grid sx={{ position: "relative" }}>
                <Input
                  className=" input-style-1c mt-12 width100"
                  type={showconfrim ? "text" : "password"}
                  disableUnderline
                  value={confirmPasswordValue}
                  onChange={handlePasswordChange}
                  onKeyUp={handleValidation}
                  name="confirmPassword"
                />
                <Typography
                  sx={{ position: "absolute", top: 18, right: 5 }}
                  align="right"
                  className="fs-24 cursor-point "
                  onClick={() => setShowConfrim(!showconfrim)}
                >
                  {showconfrim ? (
                    <AiOutlineEye color="grey" />
                  ) : (
                    <AiOutlineEyeInvisible color="grey" />
                  )}
                </Typography>
                <Typography className="red-typo">
                  {confirmPasswordError}
                </Typography>{" "}
              </Grid>
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
            type="submit"
            className={
              passwordInput?.confirmPassword?.length < 6
                ? "skyblue-br-button  width-100 hover"
                : "skyblue-bg-button   width-100  hover"
            }
            onClick={() => {
              CraeteTechnician();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
