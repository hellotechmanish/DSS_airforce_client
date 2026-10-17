// Import Server Component
import React, { useState } from "react";
import { Typography, Grid, Input, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
// import LeftLogo from "../../assets/img/Left-logo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { POST } from "../../lib/request.js";
import { API } from "../../lib/endpoint.js";
import { Link } from "react-router-dom";
// import { useAuth } from "../../context/useAuth.js";
import { useAuth } from "../../context/AuthContext.js";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { navbarLogo, navbarSubtitle, navbarTitle } from "../../lib/branding";

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
  const [loading, setloading] = useState();

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

    setloading(true);

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

      toast.success("Login successfully");

      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      console.error("Login error =>", err);
      toast.error(err?.response?.data?.msg || "Login failed");
    } finally {
      setloading(false); //  ALWAYS stop loader
    }
  };

  return (
    <>
      {/* ================= Snackbar ================= */}
      <Snackbar open={snackopen} autoHideDuration={6000} onClose={SnanbarClose}>
        <Alert onClose={SnanbarClose} severity="success">
          {snackmsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackerropen}
        autoHideDuration={3000}
        onClose={SnackbarErrorClose}
      >
        <Alert onClose={SnackbarErrorClose} severity="error">
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
          width: "100%",
          background: "linear-gradient(to bottom, #001f3f, #003366)",
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          boxSizing: "border-box",
        }}
      >
        {/* ================= Responsive Header ================= */}
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            width: "100%",
            maxWidth: "1200px",
            pt: { xs: 2, sm: 3, md: 4 },
            gap: { xs: 1.5, sm: 3 },
          }}
        >
          {/* Left Logo Only */}
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={navbarLogo}
              alt="Logo"
              style={{
                display: "block",
                width: "clamp(55px, 10vw, 100px)",
                height: "auto",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Grid>

          {/* Responsive Title */}
          <Grid
            item
            xs
            sx={{
              minWidth: 0,
              textAlign: { xs: "left", sm: "center" },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                letterSpacing: { xs: "0.3px", sm: "1px" },
                fontSize: {
                  xs: "clamp(16px, 4vw, 20px)",
                  sm: "26px",
                  md: "34px",
                  lg: "40px",
                },
                lineHeight: 1.25,
                overflowWrap: "break-word",
              }}
            >
              {navbarTitle}
            </Typography>

            <Typography
              sx={{
                color: "#d9d9d9",
                fontWeight: 500,
                fontSize: {
                  xs: "11px",
                  sm: "15px",
                  md: "18px",
                  lg: "22px",
                },
                lineHeight: 1.4,
                mt: 0.5,
              }}
            >
              {navbarSubtitle}
            </Typography>
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
            px: { xs: 0, sm: 2 },
          }}
        >
          <form
            onSubmit={handleSubmit(SignSubmit)}
            style={{
              width: "100%",
              maxWidth: "420px",
              minWidth: 0,
            }}
          >
            <Grid
              item
              sx={{
                background: "white",
                p: { xs: 2.5, sm: 4, md: 5 },
                width: "100%",
                boxSizing: "border-box",
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
                  boxSizing: "border-box",
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

              <Grid
                container
                sx={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <Input
                  fullWidth
                  disableUnderline
                  value={password}
                  type={show ? "text" : "password"}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    paddingRight: "38px",
                    marginTop: "8px",
                    boxSizing: "border-box",
                  }}
                  {...register("Password", {
                    required: "Password is required.",
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />

                {/* Password Visibility Toggle */}
                <Grid
                  onClick={() => setShow(!show)}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-35%)",
                    cursor: "pointer",
                    color: "#003366",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  {show ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
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
                disabled={loading}
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
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters
                      className="spin"
                      style={{ marginRight: 8 }}
                    />
                    Logging in...
                  </>
                ) : (
                  "LOGIN"
                )}
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
