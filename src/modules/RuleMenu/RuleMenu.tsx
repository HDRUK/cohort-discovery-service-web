"use client";

import ToolGuidance from "@/content/guidance/tool.mdx";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import ActionMenuSection from "@/components/ActionMenuSection";

function CustomH1({ children }: { children: ReactNode }) {
  return (
    <Typography variant="guidance1" sx={{ borderBottom: 2, my: 1 }}>
      {children}
    </Typography>
  );
}

function CustomH2({ children }: { children: ReactNode }) {
  return <Typography variant="guidance2">{children}</Typography>;
}

const overrideGuidanceComponents = {
  h1: CustomH1,
  h2: CustomH2,
};

const RuleMenu = () => {
  const queryBuilderJson = useQueryBuilder((qb) => qb.queryBuilderJson);

  return (
    <Box sx={{ px: 1 }}>
      {queryBuilderJson.rules.length === 0 && (
        <ActionMenuSection title={"Tool Guidance"} defaultExpanded>
          <ToolGuidance components={overrideGuidanceComponents} />
        </ActionMenuSection>
      )}
    </Box>
  );
};

export default RuleMenu;
