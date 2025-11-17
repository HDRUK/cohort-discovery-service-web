import React from "react";
import Paper from "@mui/material/Paper";
import { Grid, GridProps } from "@mui/material";

const SwimLane: React.FC<GridProps> = ({ children, ...rest }) => (
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
        p: 2,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
      }}
    >
      {children}
    </Paper>
  </Grid>
);

export default SwimLane;
