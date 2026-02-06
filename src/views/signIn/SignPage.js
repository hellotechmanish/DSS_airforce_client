// Import Server Component
import React, { useState } from "react";
import { Typography, Grid, Input, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import LeftLogo from "../../assets/img/Left-logo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { POST } from "../../lib/request.js";
import { API } from "../../lib/endpoint.js";
import { Link } from "react-router-dom";
// import { useAuth } from "../../context/useAuth.js";
import { useAuth } from "../../context/AuthContext.js";
import { toast } from "react-hot-toast";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ===================== SnackBar ==================== //
  const [snackopen, setSnackOpen] = useState(false);
  const [snackmsg, setSnackMsg] = useState("");
  const [snackErrMsg, setSnackErrMsg] = useState();
  const [snackerropen, setSnackerropen] = useState(false);
  const [show, setShow] = React.useState(false);
  const { login } = useAuth();

  console.log(">>login", login);

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

  const SignSubmit = async () => {
    const body = {
      uid: uid,
      password: password,
    };

    try {
      console.log("Request body =>", body);

      const resp = await POST(API.AUTH.LOGIN, body);
      if (resp.token) {
        localStorage.setItem("token", resp.token);

        localStorage.setItem(
          "userData",
          JSON.stringify({
            user: resp.user,
            token: resp.token,
          }),
        );
      }
      // login(resp.user, resp.token);
      console.log("Full response =>", resp);
      toast.success("Login successfully");

      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      console.error("Login error =>", err);
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  // code for title change start here
  const loadSavedData = () => {
    const savedData = localStorage.getItem("inputValues");
    return savedData
      ? JSON.parse(savedData)
      : { word1: "Indian Airforce", word2: "", word3: "" };
  };
  const [inputValues, setInputValues] = useState(loadSavedData());
  // code for title change end here

  return (
    <>
      <Snackbar open={snackopen} autoHideDuration={6000} onClose={SnanbarClose}>
        <Alert onClose={SnanbarClose} severity={"success"}>
          {snackmsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackerropen}
        autoHideDuration={3000}
        onClose={SnackbarErrorClose}
      >
        <Alert onClose={SnackbarErrorClose} severity={"error"}>
          {snackErrMsg}
        </Alert>
      </Snackbar>

      <Grid
        container
        direction="column"
        alignItems="center"
        className="login-bg"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #001f3f, #003366)",
        }}
      >
        {/* Header Section */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{
            width: "90%",
            paddingTop: "20px",
          }}
        >
          <Grid item>
            <img src={LeftLogo} alt="LeftLogo" style={{ height: "70px" }} />
          </Grid>

          <Grid item>
            <Typography
              align="center"
              style={{
                color: "white",
                fontSize: "40px",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              {inputValues.word1}
            </Typography>

            <Typography
              align="center"
              style={{
                color: "#d9d9d9",
                fontSize: "22px",
                fontWeight: 500,
              }}
            >
              Online Resistance Monitoring System
            </Typography>
          </Grid>

          <Grid item>
            <img src={LeftLogo} alt="RightLogo" style={{ height: "70px" }} />
          </Grid>
        </Grid>

        {/* Login Card */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "60px" }}
        >
          <form onSubmit={handleSubmit(SignSubmit)}>
            <Grid
              item
              style={{
                background: "white",
                padding: "45px",
                width: "420px",
                borderRadius: "6px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                borderTop: "6px solid #ff9933", // tricolor hint
              }}
            >
              <Typography
                align="center"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#003366",
                  marginBottom: "25px",
                }}
              >
                LOGIN
              </Typography>

              {/* UID */}
              <Typography style={{ fontWeight: 600, color: "#333" }}>
                Enter UID
              </Typography>

              <Input
                fullWidth
                disableUnderline
                value={uid}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "8px",
                }}
                {...register("Uid", {
                  required: "Uid is required",
                  onChange: (e) => setUid(e.target.value),
                })}
              />

              {errors?.Uid && (
                <Typography style={{ color: "red", fontSize: "13px" }}>
                  {errors?.Uid?.message}
                </Typography>
              )}

              {/* Password */}
              <Typography
                style={{
                  fontWeight: 600,
                  color: "#333",
                  marginTop: "20px",
                }}
              >
                Enter Password
              </Typography>

              <Grid container style={{ position: "relative" }}>
                <Input
                  fullWidth
                  disableUnderline
                  value={password}
                  type={show ? "text" : "password"}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    marginTop: "8px",
                  }}
                  {...register("Password", {
                    required: "Password is required.",
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />

                <Grid
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "18px",
                  }}
                >
                  <Typography
                    onClick={() => setShow(!show)}
                    style={{ cursor: "pointer", color: "#003366" }}
                  >
                    {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </Typography>
                </Grid>
              </Grid>

              {errors?.Password && (
                <Typography style={{ color: "red", fontSize: "13px" }}>
                  {errors?.Password?.message}
                </Typography>
              )}

              {/* Forgot Password */}
              <Typography align="right" style={{ marginTop: "12px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#003366",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot Password?
                </Link>
              </Typography>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  marginTop: "30px",
                  backgroundColor: "#003366",
                  padding: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                LOGIN
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
