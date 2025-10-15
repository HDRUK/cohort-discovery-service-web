import React from "react";
import Paper, { PaperProps } from "@mui/material/Paper";

const SwimLane: React.FC<PaperProps> = ({ children, sx, ...rest }) => (
  <Paper sx={{ bgcolor: "white", p: 2, ...sx }} {...rest}>
    {children}
  </Paper>
);

export default SwimLane;
