"use client";

import { Box } from "@mui/material";
import { RuleGroupBodyComponents, UseRuleGroup } from "react-querybuilder";

const RuleGroupBody = (rg: UseRuleGroup) => {
  return (
    <Box sx={{ display: "flex", gap: 2, my: 2, flexDirection: "column" }}>
      <RuleGroupBodyComponents {...rg} />
    </Box>
  );
};

export default RuleGroupBody;
