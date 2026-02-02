import React, { useState, useEffect } from "react";
import { Grid, Container, Typography, Input } from "@mui/material";
import { FETCH_URL } from "../../../../../../fetchIp";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
//React Icons
// export default function MaxWidthDialog({
//   show,
//   uid,
//   setUid,
//   fullName,
//   setFullName,
//   confirmPasswordValue,
//   passwordValue,
//   handlePasswordChange,
//   handleValidation,
//   confirmPasswordError,
//   passwordError,
// }) {
export default function MaxWidthDialog(props) {
  const {
    states: {
      open,
      show,
      setShow,
      uid,
      setUid,
      fullName,
      setFullName,
      passwordValid,
      confirmpassValid,
      confirmPasswordValue,
      passwordValue,
      confirmPasswordError,
      fullNameErr,
      uidErr,
      passwordError,
      passwordInput,
    },
    handlePasswordChange,
    handleValidation,
  } = props;
  const [showconfrim, setShowConfrim] = useState(false);
  const [uidMatch, setUidMatch] = useState(true);
  const CheckUserUid = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;

    try {
      const response = await fetch(`${FETCH_URL}/api/user/checkUserUid`, {
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
    if (open && uid) {
      CheckUserUid(uid);
    }
  }, [uid]);
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Grid container justifyContent="space-between">
          <Grid item md={5.8}>
            <Typography className="heading-black mt-16">Full Name</Typography>
            <Input
              className={
                fullNameErr
                  ? " input-style-1c-warn mt-12 width100"
                  : "input-style-1c  mt-12 width100"
              }
              disableUnderline
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {fullNameErr && (
              <Typography className="red-typo" variant={"subtitle2"}>
                {"Please enter the full name here!"}
              </Typography>
            )}
          </Grid>
          <Grid item md={5.8}>
            <Typography className="heading-black mt-16">UID</Typography>
            <Input
              className={
                uidErr || uidMatch === false
                  ? " input-style-1c-warn mt-12 width100"
                  : "input-style-1c  mt-12 width100"
              }
              disableUnderline
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
            {uidMatch === false ? (
              <Typography className="red-typo" variant={"subtitle2"}>
                User Uid Already Exist !
              </Typography>
            ) : null}
            {uidErr && (
              <Typography className="red-typo" variant={"subtitle2"}>
                {"Please enter the Uid here !"}
              </Typography>
            )}
          </Grid>
          <Grid item md={5.8}>
            <Typography className="heading-black mt-12">Password</Typography>
            <Grid sx={{ position: "relative" }}>
              <Input
                className={
                  passwordError || passwordValid
                    ? " input-style-1c-warn mt-12 width100"
                    : "input-style-1c  mt-12 width100"
                }
                type={show ? "text" : "password"}
                // type="password"
                disableUnderline
                value={passwordValue ? passwordValue : passwordInput?.password}
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
              {passwordValid && (
                <Typography className="red-typo" variant={"subtitle2"}>
                  {"Please enter the password here!"}
                </Typography>
              )}
              <Typography className="red-typo" variant={"subtitle2"}>
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
                className={
                  confirmPasswordError || confirmpassValid
                    ? " input-style-1c-warn mt-12 width100"
                    : "input-style-1c  mt-12 width100"
                }
                disableUnderline
                type={showconfrim ? "text" : "password"}
                value={
                  confirmPasswordValue
                    ? confirmPasswordValue
                    : passwordInput?.confirmPassword
                }
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
              <Typography className="red-typo" variant={"subtitle2"}>
                {confirmPasswordError}
              </Typography>
              {confirmpassValid && (
                <Typography className="red-typo" variant={"subtitle2"}>
                  {"Please enter the confirm password here!"}
                </Typography>
              )}
            </Grid>{" "}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
