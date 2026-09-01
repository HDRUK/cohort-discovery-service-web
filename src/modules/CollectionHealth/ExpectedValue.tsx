"use client";

import { useState } from "react";
import { Chip, TextField, Tooltip } from "@mui/material";

interface ExpectedValueProps {
  value: number | null | undefined;
  onSave: (value: number | null) => void;
  prefix?: string;
}

const ExpectedValue = ({
  value,
  onSave,
  prefix = "Expected",
}: ExpectedValueProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? "");

  const commit = () => {
    setEditing(false);
    onSave(draft.trim() === "" ? null : Number(draft));
  };

  if (editing) {
    return (
      <TextField
        type="number"
        size="small"
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setEditing(false);
            setDraft(value?.toString() ?? "");
          }
        }}
        slotProps={{
          htmlInput: { min: 0, style: { width: 72, padding: "4px 6px" } },
        }}
      />
    );
  }

  return (
    <Tooltip title="Click to set the expected count for this collection">
      <Chip
        label={`${prefix} ${value != null ? value.toLocaleString() : "—"}`}
        size="small"
        variant="outlined"
        onClick={() => setEditing(true)}
        sx={{ cursor: "pointer" }}
      />
    </Tooltip>
  );
};

export default ExpectedValue;
