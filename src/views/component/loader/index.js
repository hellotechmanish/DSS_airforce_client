import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { circularProgressClasses } from "@mui/material/CircularProgress";

export default function FacebookCircularProgress(props) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.5)",
        zIndex: 9999,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={40}
          thickness={4}
          sx={{ color: "#E5E7EB" }}
        />

        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={40}
          thickness={4}
          {...props}
          sx={{
            color: "#5932EA",
            animationDuration: "1500ms",
            position: "absolute",
            top: 0,
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "#4B5563",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Please wait while the system is starting...
      </Typography>
    </Box>
  );
}
