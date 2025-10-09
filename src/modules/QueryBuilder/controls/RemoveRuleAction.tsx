"use client";

import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const RemoveRuleAction = ({ handleOnClick }: ActionWithRulesProps) => {
  return (
    <IconButton onClick={handleOnClick} color="error">
      <Delete />
    </IconButton>
  );
};

export default RemoveRuleAction;
