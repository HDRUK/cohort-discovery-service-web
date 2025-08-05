"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const LockRuleAction = ({ handleOnClick, disabled }: ActionWithRulesProps) => {
  return (
    <Tooltip title={disabled ? "Unlock Rule" : "Lock Rule"}>
      <IconButton onClick={handleOnClick}>
        {disabled ? <LockOpen /> : <Lock />}
      </IconButton>
    </Tooltip>
  );
};

export default LockRuleAction;
