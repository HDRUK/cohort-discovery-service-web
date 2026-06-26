"use client";

import { TextField } from "@mui/material";
import { useState } from "react";

function NumericValueInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const [draft, setDraft] = useState<string>(value != null ? String(value) : "");
  const [lastValue, setLastValue] = useState<number | null>(value);

  if (lastValue !== value) {
    setLastValue(value);
    setDraft(value != null ? String(value) : "");
  }

  const commit = () => {
    if (draft === "") {
      onChange(null);
      return;
    }
    const n = parseFloat(draft);
    if (!Number.isNaN(n)) onChange(n);
  };

  return (
    <TextField
      size="small"
      type="number"
      value={draft}
      slotProps={{ htmlInput: { step: "any" } }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
      }}
    />
  );
}

export default NumericValueInput;
