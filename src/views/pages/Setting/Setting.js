import React, { useState, useEffect } from "react";
import {
  Grid,
  Breadcrumbs,
  Typography,
  Container,
  Input,
  Button,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FETCH_URL } from "../../../fetchIp";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../../../context/AuthContext";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function UserManagment() {
  const [inputState, setInputState] = useState(true);
  let Admin = JSON.parse(localStorage.getItem("userData"));
  const auth = React.useContext(AuthContext);

  const [uid, setUid] = useState(Admin?.user?.uid);
  const [fullname, setFullName] = useState(Admin?.user?.fullName);

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
  console.log("Admin Details", Admin);

  function ChangeInputState() {
    setInputState(false);
  }

  function ChangeInputCancel() {
    setInputState(true);
    setShow(!show);
  }

  const EditAdminDetails = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/editUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullname,
          uid: uid,
          userRole: Admin?.user?.role,
          userId: Admin?.user?._id,
        }),
      });
      const res = await response.json();

      if (response.ok) {
        // setOpen(false);
        setInputState(true);
        setSnackOpen(true);
        setSnackMsg(res.msg);
        UserPassWordRest();
      } else {
        // console.log("Else block ====>");
        // setOpen(false);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };

  const [show, setShow] = useState(false);
  const PasswordHide = () => {
    setShow(!show);
  };
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

  const UserPassWordRest = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/user/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Admin?.user?._id,
          password: newPassword,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        // console.log("Password Reset ", res.msg);
        setShow(!show);
        setSnackOpen(true);
        setSnackMsg(res.msg);
        setInputState(true);
      } else {
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  return (
    <>
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
      <Container maxWidth="xl">
        <Grid container direction="row" className="widthLR-90 mt-24">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              to="/dashboard"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="sky-typo fs-16">Dashboard</Typography>
            </Link>
            ,
            <Link to="/setting" className="linkcolor" underline="hover" key="1">
              <Typography className="heading-black  ">Setting</Typography>{" "}
            </Link>
          </Breadcrumbs>
          <Grid container>
            <Typography className="sky-typo fs-20 mt-24">Admin</Typography>
            <Grid container justifyContent="space-between">
              <Grid item md={2.8}>
                <Typography className="heading-black mt-12">UID</Typography>

                <Input
                  className="input-style-1c mt-12 width100"
                  disableUnderline
                  value={uid}
                  disabled={inputState || Admin.user.role === 0 ? true : false}
                  onChange={(e) => setUid(e.target.value)}
                />
              </Grid>{" "}
              <Grid item md={2.8}>
                <Typography className="heading-black mt-12">
                  Full Name
                </Typography>
                <Input
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  disabled={inputState || Admin.user.role === 0 ? true : false}
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>{" "}
              <Grid item md={2.8}>
                <Typography className="heading-black mt-12">
                  Password
                </Typography>
                <Input
                  className=" input-style-1c mt-12 width100"
                  disableUnderline
                  disabled={inputState}
                  value={passwordValue}
                  type={show ? passwordValue : "password"}
                  defaultValue={inputState === false ? null : "********"}
                  onChange={handlePasswordChange}
                  onKeyUp={handleValidation}
                  name="password"
                />
                <Typography className="red-typo">{passwordError}</Typography>
              </Grid>
              {inputState === false ? (
                <>
                  <Grid item md={2.8}>
                    <Typography className="heading-black mt-12">
                      Confirm Password
                    </Typography>
                    <Input
                      className=" input-style-1c mt-12 width100"
                      disableUnderline
                      disabled={inputState}
                      value={confirmPasswordValue}
                      type={show ? confirmPasswordValue : "password"}
                      // defaultValue="********"
                      onChange={handlePasswordChange}
                      onKeyUp={handleValidation}
                      name="confirmPassword"
                    />
                    <Typography className="red-typo">
                      {confirmPasswordError}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={0.1}
                    className="mt-52 "
                    onClick={() => PasswordHide()}
                  >
                    {show ? (
                      <AiOutlineEye className="sky-typo" />
                    ) : (
                      <AiOutlineEyeInvisible className="sky-typo" />
                    )}
                  </Grid>
                </>
              ) : null}
            </Grid>
          </Grid>
          <Grid container justifyContent="right" className="mt-24">
            {inputState ? (
              <>
                <Button
                  className="skyblue-br-button width-150 hover"
                  onClick={() => ChangeInputState()}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="  grey-br-button width-150 mr-10 hover "
                  onClick={() => ChangeInputCancel()}
                >
                  Cancel
                </Button>
                {auth.user.role === 0 ? (
                  <Button
                    className="skyblue-bg-button width-150 hover"
                    onClick={() => UserPassWordRest()}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    className="skyblue-bg-button width-150 hover"
                    onClick={() => EditAdminDetails()}
                  >
                    Update
                  </Button>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
