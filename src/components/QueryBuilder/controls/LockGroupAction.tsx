"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const LockGroupAction = ({ handleOnClick, disabled }: ActionWithRulesProps) => {
  return (
    <Tooltip title={disabled ? "Unlock Group" : "Lock Group"}>
      <IconButton onClick={handleOnClick}>
        {disabled ? <LockOpen /> : <Lock />}
      </IconButton>
    </Tooltip>
  );
};

export default LockGroupAction;
