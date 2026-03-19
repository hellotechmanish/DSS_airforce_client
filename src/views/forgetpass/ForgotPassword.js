import React from "react";
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
import { useState } from "react";
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

  const newPassword = watch("newPassword");

  const handleForgotPassword = async (data) => {
    if (loading) return; // prevent double click

    const payload = {
      uid: data.uid,
      secretKey: data.secretKey,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    try {
      setLoading(true);

      const response = await POST(API.AUTH.FORGOTPASSWORD, payload);

      if (response?.msg === "Password reset successful") {
        // setSnackmsg(response.msg);
        // setSnackopen(true);

        setTimeout(() => {
          navigate("/signIn");
        }, 1500);
      }
    } catch (error) {
      //   setSnackErrMsg(error?.msg || "Something went wrong");
      //   setSnackerropen(true);
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
        // background: "#f4f6f9",
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
          {/* Header */}
          <Typography
            variant="h5"
            align="center"
            style={{
              fontWeight: 600,
              color: "#003366",
              marginBottom: "10px",
            }}
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
              {...register("uid", {
                required: "UID is required",
              })}
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
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />

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
              disabled={loading}
              style={{
                marginTop: "30px",
                backgroundColor: "#003366",
                padding: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
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

            {/* Back to Login */}
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
