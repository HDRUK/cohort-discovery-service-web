"use client";

import { IconButton, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const CloneRuleAction = ({ handleOnClick }: ActionWithRulesProps) => {
  return (
    <Tooltip title="Clone Rule">
      <IconButton onClick={handleOnClick}>
        <ContentCopy />
      </IconButton>
    </Tooltip>
  );
};

export default CloneRuleAction;
