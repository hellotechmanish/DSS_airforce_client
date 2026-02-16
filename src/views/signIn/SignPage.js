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
  const [inputValues] = useState(loadSavedData());
  // code for title change end here

  return (
    <>
      {/* ================= Snackbar ================= */}
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

      {/* ================= Main Container ================= */}
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #001f3f, #003366)",
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        {/* ================= Header Section ================= */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: "100%",
            maxWidth: "1200px",
            pt: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Left Logo */}
          <Grid item xs={3} sm={2}>
            <img
              src={LeftLogo}
              alt="LeftLogo"
              style={{
                height: "auto",
                width: "100%",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Grid>

          {/* Title */}
          <Grid item xs={6} sm={8} textAlign="center">
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                letterSpacing: "1px",
                fontSize: {
                  xs: "20px",
                  sm: "26px",
                  md: "34px",
                  lg: "40px",
                },
              }}
            >
              {inputValues.word1}
            </Typography>

            <Typography
              sx={{
                color: "#d9d9d9",
                fontWeight: 500,
                fontSize: {
                  xs: "12px",
                  sm: "15px",
                  md: "18px",
                  lg: "22px",
                },
              }}
            >
              Online Resistance Monitoring System
            </Typography>
          </Grid>

          {/* Right Logo */}
          <Grid item xs={3} sm={2} textAlign="right">
            <img
              src={LeftLogo}
              alt="RightLogo"
              style={{
                height: "auto",
                width: "100%",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Grid>
        </Grid>

        {/* ================= Login Card ================= */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            mt: { xs: 4, sm: 6, md: 8 },
            width: "100%",
          }}
        >
          <form
            onSubmit={handleSubmit(SignSubmit)}
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <Grid
              item
              sx={{
                background: "white",
                p: { xs: 3, sm: 4, md: 5 },
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                borderTop: "6px solid #ff9933",
              }}
            >
              {/* Login Title */}
              <Typography
                align="center"
                sx={{
                  fontWeight: 700,
                  color: "#003366",
                  mb: 3,
                  fontSize: {
                    xs: "20px",
                    sm: "22px",
                    md: "24px",
                  },
                }}
              >
                LOGIN
              </Typography>

              {/* UID */}
              <Typography sx={{ fontWeight: 600 }}>Enter UID</Typography>

              <Input
                fullWidth
                disableUnderline
                value={uid}
                sx={{
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
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {errors?.Uid?.message}
                </Typography>
              )}

              {/* Password */}
              <Typography
                sx={{
                  fontWeight: 600,
                  marginTop: "20px",
                }}
              >
                Enter Password
              </Typography>

              <Grid container sx={{ position: "relative" }}>
                <Input
                  fullWidth
                  disableUnderline
                  value={password}
                  type={show ? "text" : "password"}
                  sx={{
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
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "18px",
                    cursor: "pointer",
                    color: "#003366",
                  }}
                  onClick={() => setShow(!show)}
                >
                  {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </Grid>
              </Grid>

              {errors?.Password && (
                <Typography sx={{ color: "red", fontSize: "13px" }}>
                  {errors?.Password?.message}
                </Typography>
              )}

              {/* Forgot Password */}
              <Typography align="right" sx={{ mt: 1 }}>
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
                sx={{
                  mt: 3,
                  backgroundColor: "#003366",
                  py: 1.5,
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#002244",
                  },
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
