"use client";

import { useState } from "react";
import { Chip, TextField, Tooltip } from "@mui/material";
import { RegressionTestCollection } from "@/types/api";

interface EditableExpectedProps {
  col: RegressionTestCollection;
  onSave: (value: number | null) => void;
}

const EditableExpected = ({ col, onSave }: EditableExpectedProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(col.expected_result?.toString() ?? "");

  const commit = () => {
    setEditing(false);
    const num = value.trim() === "" ? null : Number(value);
    onSave(num);
  };

  if (editing) {
    return (
      <TextField
        type="number"
        size="small"
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setEditing(false);
            setValue(col.expected_result?.toString() ?? "");
          }
        }}
        slotProps={{
          htmlInput: { min: 0, style: { width: 72, padding: "4px 6px" } },
        }}
      />
    );
  }

  return (
    <Tooltip title="Click to set expected count">
      <Chip
        label={col.expected_result != null ? col.expected_result.toLocaleString() : "—"}
        size="small"
        variant="outlined"
        onClick={() => setEditing(true)}
        sx={{ cursor: "pointer" }}
      />
    </Tooltip>
  );
};

export default EditableExpected;
