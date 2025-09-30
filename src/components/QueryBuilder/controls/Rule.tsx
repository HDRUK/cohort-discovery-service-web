"use client";

import { forwardRef } from "react";
import { Box } from "@mui/material";
import { Rule as OrigRule, RuleProps } from "react-querybuilder";

const Rule = forwardRef<HTMLDivElement, RuleProps>((props, ref) => {
  const { id } = props;

  return (
    <div ref={ref} data-query-builder-id={id}>
      <Box
        sx={{
          '& [data-testid="rule"]': {
            display: "flex",
            gap: 2,
          },
        }}
      >
        <OrigRule {...props} />
      </Box>
    </div>
  );
});

Rule.displayName = "Rule";
export default Rule;
