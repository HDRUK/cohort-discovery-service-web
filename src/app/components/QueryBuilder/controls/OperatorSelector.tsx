"use client";

import { Select, MenuItem } from "@mui/material";
import { ValueSelectorProps } from "react-querybuilder";

const OperatorSelector = ({
  options,
  value,
  handleOnChange,
}: ValueSelectorProps) => {
  return (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default OperatorSelector;
