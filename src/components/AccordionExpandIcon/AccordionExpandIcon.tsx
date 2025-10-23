"use client";

import * as React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

const AccordionExpandIcon = ({ expanded }: { expanded: boolean }) => {
  if (expanded) return <HorizontalRuleIcon />;
  return <ExpandMoreIcon />;
};

export default AccordionExpandIcon;
