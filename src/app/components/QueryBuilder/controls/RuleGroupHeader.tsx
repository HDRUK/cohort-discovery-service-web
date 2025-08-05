"use client";

import { Box } from "@mui/material";
import { RuleGroupHeaderComponents, UseRuleGroup } from "react-querybuilder";

const RuleGroupHeader = (rg: UseRuleGroup) => {
  return (
    <Box sx={{ display: "flex", gap: 2, my: 2 }}>
      <RuleGroupHeaderComponents {...rg} />
    </Box>
  );
};

export default RuleGroupHeader;
