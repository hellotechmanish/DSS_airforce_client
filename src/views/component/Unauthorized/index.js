import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", background: "#0f172a", color: "white" }}
    >
      <Grid
        item
        xs={10}
        md={5}
        style={{
          textAlign: "center",
          padding: "40px",
          borderRadius: "12px",
          background: "#1e293b",
        }}
      >
        <LockIcon style={{ fontSize: "60px", marginBottom: "16px" }} />

        <Typography variant="h4" gutterBottom>
          403 - Access Denied
        </Typography>

        <Typography variant="body1" style={{ marginBottom: "24px" }}>
          You do not have permission to access this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </Grid>

          <Grid item>
            {/* <Button
              variant="outlined"
              style={{ color: "white", borderColor: "white" }}
              onClick={() => {
                localStorage.clear();
                navigate("/signIn");
              }}
            >
              Login Again
            </Button> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Unauthorized;
