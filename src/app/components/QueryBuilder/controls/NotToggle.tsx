"use client";

import { Switch, FormControlLabel } from "@mui/material";
import { NotToggleProps } from "react-querybuilder";

const NotToggle = ({ checked, handleOnChange }: NotToggleProps) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => handleOnChange(e.target.checked)}
          color="primary"
        />
      }
      label="NOT"
      labelPlacement="end"
    />
  );
};

export default NotToggle;
