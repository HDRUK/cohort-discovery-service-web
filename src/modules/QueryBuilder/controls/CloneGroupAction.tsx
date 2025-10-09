"use client";

import { IconButton, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const CloneGroupAction = ({ handleOnClick }: ActionWithRulesProps) => {
  return (
    <Tooltip title="Clone Group">
      <IconButton onClick={handleOnClick}>
        <ContentCopy />
      </IconButton>
    </Tooltip>
  );
};

export default CloneGroupAction;
