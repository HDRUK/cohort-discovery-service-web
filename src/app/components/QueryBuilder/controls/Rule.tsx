"use client";

import { Box } from "@mui/material";
import { Rule as OrigRule, RuleProps } from "react-querybuilder";

const Rule = (props: RuleProps) => {
  return (
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
  );
};

export default Rule;
