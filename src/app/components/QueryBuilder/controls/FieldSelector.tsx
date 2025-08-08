"use client";

import { Select, MenuItem } from "@mui/material";
import { ValueSelectorProps } from "react-querybuilder";

const FieldSelector = ({
  options,
  value,
  handleOnChange,
  disabled,
}: ValueSelectorProps) => {
  return (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
      disabled={disabled}
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default FieldSelector;
