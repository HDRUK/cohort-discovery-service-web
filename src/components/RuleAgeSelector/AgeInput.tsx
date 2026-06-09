"use client";

import { FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { clamp } from "@/utils/numbers";

function AgeInput({
  value,
  onChange,
  minAge,
  maxAge,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  minAge: number;
  maxAge: number;
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
    const n = Number(draft);
    if (!Number.isNaN(n)) onChange(clamp(n, minAge, maxAge));
  };

  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <TextField
          size="small"
          type="number"
          value={draft}
          slotProps={{ htmlInput: { min: minAge, max: maxAge } }}
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
      }
      slotProps={{ typography: { sx: { mx: 1 } } }}
      label="Years"
    />
  );
}

export default AgeInput;
