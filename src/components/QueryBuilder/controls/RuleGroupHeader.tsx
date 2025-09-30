"use client";

import { forwardRef } from "react";
import { Box } from "@mui/material";
import { RuleGroupHeaderComponents, UseRuleGroup } from "react-querybuilder";

const RuleGroupHeader = forwardRef<HTMLDivElement, UseRuleGroup>((rg, ref) => {
  const qbId =
    rg.id ?? (Array.isArray(rg.path) ? rg.path.join("_") : undefined);

  return (
    <Box
      ref={ref}
      sx={{ display: "flex", gap: 2, my: 2 }}
      data-query-builder-id={qbId}
      data-query-builder-type="group-header"
    >
      <RuleGroupHeaderComponents {...rg} />
    </Box>
  );
});

RuleGroupHeader.displayName = "RuleGroupHeader";

export default RuleGroupHeader;
