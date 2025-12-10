"use client";

import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import MenuIcon from "@mui/icons-material/Menu";

const AccordionExpandIcon = ({ expanded }: { expanded: boolean }) => {
  if (expanded) return <HorizontalRuleIcon />;
  return <MenuIcon />;
};

export default AccordionExpandIcon;
