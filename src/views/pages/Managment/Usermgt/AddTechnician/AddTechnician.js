import React, { useState, useEffect } from "react";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Input,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { API } from "../../../../../lib/endpoint";
import { POST } from "../../../../../lib/request";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
//React Icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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
      <Typography className="white-typo">Add Technician </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon className="fs-20" />
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
export default function MaxWidthDialog({ getnumberOftechnician }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const [show, setShow] = useState(false);
  const [showconfrim, setShowConfrim] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [uid, setUid] = useState(null);
  const [uidMatch, setUidMatch] = useState(true);
  const [fullName, setFullName] = useState(null);
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
  const handleClose = () => {
    setOpen(false);
    setPasswordInput({ password: "", confirmPassword: "" });
    setFullName(null);
    setUid(null);
  };
  useEffect(() => {
    if (open === false) {
      setFullName("");
      setUid("");
      setPasswordInput({ password: "", confirmPassword: "" });
    }
  }, [open]);

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
    // validation
    if (!passwordInput.password) {
      setPasswordErr("Password is required");
      return;
    }

    if (!passwordInput.confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      return;
    }

    if (passwordInput.password !== passwordInput.confirmPassword) {
      setConfirmPasswordError("Confirm password is not matched");
      return;
    }

    if (passwordInput.password.length < 8) {
      setConfirmPasswordError("At least minimum 8 characters");
      return;
    }

    try {
      const res = await POST(API.USERS.CREATE, {
        password: newPassword,
        fullName: fullName,
        uid: uid,
        type: "technician",
      });

      if (res) {
        setSnackOpen(true);
        setSnackMsg(res?.msg || "Technician created successfully");

        setOpen(false);
        getnumberOftechnician();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res?.err || "Failed to create technician");

        setOpen(false);
      }
    } catch (error) {
      console.error("CraeteTechnician error:", error);

      setSnackerropen(true);
      setSnackErrMsg(error?.msg || "Failed to create technician");

      setOpen(false);
    }
  };

  const CheckUserUid = async () => {
    try {
      const res = await POST(API.USERS.CHECK_UID, {
        uid: uid,
      });

      if (res) {
        setUidMatch(res?.status || false);
      }
    } catch (error) {
      console.error("CheckUserUid error:", error);
      setUidMatch(false);
    }
  };

  useEffect(() => {
    CheckUserUid(uid);
  }, [uid]);
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
        className=" skyblue-bg-button fs-16 hover "
        onClick={handleClickOpen}
      >
        Add
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
        ></BootstrapDialogTitle>{" "}
        <form onSubmit={handleSubmit(CraeteTechnician)}>
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
                {uidMatch === false ? (
                  <Typography className="red-typo">
                    Technician Uid Already Exist !
                  </Typography>
                ) : null}
                <ErrorMessage
                  errors={errors}
                  name="UID-ErrorInput"
                  render={({ message }) => (
                    <Typography className="red-typo">{message}</Typography>
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Typography className="heading-black mt-12">
                  Password
                </Typography>{" "}
                <Grid sx={{ position: "relative" }}>
                  <Input
                    className=" input-style-1c mt-12 width100"
                    type={show ? "text" : "password"}
                    disableUnderline
                    //   onChange={passwordChange}
                    // {...register("singleErrorInput", {
                    //   required: "This is required.",
                    // })}
                    value={passwordValue}
                    onChange={handlePasswordChange}
                    onKeyUp={handleValidation}
                    name="password"
                  />{" "}
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
                  <Typography className="red-typo">
                    {passwordError}
                  </Typography>{" "}
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
                  />{" "}
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
          <DialogActions sx={{ marginBottom: "10px" }}>
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
              // disabled={newPassword?.length < 6 ? true : false}

              // onClick={() => {
              //   CraeteTechnician();
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
