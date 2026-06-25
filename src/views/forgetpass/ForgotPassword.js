import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { POST } from "../../lib/request.js";
import { API } from "../../lib/endpoint.js";
import CircularProgress from "@mui/material/CircularProgress";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("newPassword") || "";

  // 🔥 Live validations
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[#?!@$%^&*-]/.test(password),
  };

  const isPasswordValid =
    validations.length &&
    validations.upper &&
    validations.lower &&
    validations.number &&
    validations.special;

  const newPassword = password;

  const handleForgotPassword = async (data) => {
    if (loading) return;

    if (!isPasswordValid) return;

    try {
      setLoading(true);

      const response = await POST(API.AUTH.FORGOTPASSWORD, {
        uid: data.uid,
        secretKey: data.secretKey,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response?.msg === "Password reset successful") {
        navigate("/signIn");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #001f3f, #003366)",
      }}
    >
      <Grid item xs={11} sm={8} md={4}>
        <Paper
          elevation={3}
          style={{
            padding: "30px",
            borderRadius: "6px",
            borderTop: "6px solid #ff9933",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            style={{ fontWeight: 600, color: "#003366", marginBottom: "10px" }}
          >
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            align="center"
            style={{ marginBottom: "15px", color: "#555" }}
          >
            Please enter your UID and secret key to reset your password.
          </Typography>

          <Divider style={{ marginBottom: "20px" }} />

          <Box component="form" onSubmit={handleSubmit(handleForgotPassword)}>
            {/* UID */}
            <TextField
              fullWidth
              label="Previous UID"
              margin="normal"
              {...register("uid", { required: "UID is required" })}
              error={!!errors.uid}
              helperText={errors.uid?.message}
            />

            {/* Secret Key */}
            <TextField
              fullWidth
              label="Secret Key"
              margin="normal"
              type="password"
              {...register("secretKey", {
                required: "Secret key is required",
              })}
              error={!!errors.secretKey}
              helperText={errors.secretKey?.message}
            />

            {/* New Password */}
            <TextField
              fullWidth
              label="New Password"
              margin="normal"
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
                  message: "Password does not meet requirements",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />

            {/* 🔥 Live Checklist */}
            <Box mt={1} mb={2}>
              <Grid container spacing={1} fontSize="2px">
                {/* LEFT SIDE (3 items) */}
                <Grid item xs={6}>
                  <Typography color={validations.length ? "green" : "gray"}>
                    {validations.length ? "✔" : "✖"} At least 8 characters
                  </Typography>

                  <Typography color={validations.upper ? "green" : "gray"}>
                    {validations.upper ? "✔" : "✖"} One uppercase letter
                  </Typography>

                  <Typography color={validations.lower ? "green" : "gray"}>
                    {validations.lower ? "✔" : "✖"} One lowercase letter
                  </Typography>
                </Grid>

                {/* RIGHT SIDE (2 items) */}
                <Grid item xs={6}>
                  <Typography color={validations.number ? "green" : "gray"}>
                    {validations.number ? "✔" : "✖"} One number
                  </Typography>

                  <Typography color={validations.special ? "green" : "gray"}>
                    {validations.special ? "✔" : "✖"} One special character
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              margin="normal"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !isPasswordValid}
              style={{
                marginTop: "30px",
                backgroundColor: isPasswordValid ? "#003366" : "gray",
                padding: "12px",
                fontWeight: 700,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    style={{ color: "white", marginRight: "10px" }}
                  />
                  Processing...
                </>
              ) : (
                "RESET PASSWORD"
              )}
            </Button>

            <Typography
              align="center"
              style={{
                marginTop: "20px",
                cursor: "pointer",
                color: "#003366",
                fontWeight: 500,
              }}
              onClick={() => navigate("/signIn")}
            >
              Back to Login
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
