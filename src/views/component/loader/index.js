import React from "react";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export default function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      {/* Background Track */}
      <CircularProgress
        variant="determinate"
        sx={{
          color: "#E5E7EB", // Light gray color for the track
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />

      {/* Moving Spinner */}
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: "#5932EA", // Main purple color
          animationDuration: "1500ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}
