"use client";

import * as React from "react";
import { Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
const AccordionExpandIcon = () => {
  return (
    <Box
      sx={{
        ".Mui-expanded & > .collapsIconWrapper": {
          display: "none",
        },
        ".expandIconWrapper": {
          display: "none",
        },
        ".Mui-expanded & > .expandIconWrapper": {
          display: "block",
        },
      }}
    >
      <div className="expandIconWrapper">
        <ExpandMoreIcon />
      </div>
      <div className="collapsIconWrapper">
        <HorizontalRuleIcon />
      </div>
    </Box>
  );
};

export default AccordionExpandIcon;
