import React from "react";
import Paper from "@mui/material/Paper";
import { Box, Grid, GridProps } from "@mui/material";

interface SwimLaneProps extends GridProps {
  scrollable?: boolean;
}

const SwimLane = ({ children, scrollable = true, ...rest }: SwimLaneProps) => (
  <Grid
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      height: "100%",
    }}
    {...rest}
  >
    <Paper
      sx={{
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflowY: scrollable ? "auto" : undefined,
        }}
      >
        {children}
      </Box>
    </Paper>
  </Grid>
);

export default SwimLane;
