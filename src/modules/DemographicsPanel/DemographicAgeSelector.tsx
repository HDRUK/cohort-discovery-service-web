"use client";

import { useMemo, useState } from "react";
import { Slider, Stack, TextField } from "@mui/material";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";

interface DemographicAgeSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const clampRange = (l: number, r: number): [number, number] => [
  Math.max(MIN_AGE_FILTER, Math.min(l, r)),
  Math.min(MAX_AGE_FILTER, Math.max(l, r)),
];

const numberFieldSx = {
  maxWidth: "7ch",
  flexShrink: 0,
  "& .MuiOutlinedInput-root": { borderRadius: 1 },
};

const numberInputProps = {
  step: 1,
  min: MIN_AGE_FILTER,
  max: MAX_AGE_FILTER,
  type: "number",
  "aria-labelledby": "demographic-age-slider",
  sx: { p: 0.5 },
};

const DemographicAgeSelector = ({
  value,
  onChange,
}: DemographicAgeSelectorProps) => {
  const [draft, setDraft] = useState<[number, number] | null>(null);
  const current = useMemo(() => draft ?? value, [draft, value]);

  const commit = (next: [number, number]) => {
    setDraft(null);
    onChange(clampRange(next[0], next[1]));
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ flex: 1, py: 1 }}
    >
      <TextField
        value={current[0]}
        size="small"
        onChange={(e) =>
          setDraft([e.target.value === "" ? 0 : Number(e.target.value), current[1]])
        }
        onBlur={() => commit(current)}
        onKeyDown={(e) => e.key === "Enter" && commit(current)}
        slotProps={{ htmlInput: numberInputProps }}
        sx={numberFieldSx}
      />
      <Slider
        value={current}
        min={MIN_AGE_FILTER}
        max={MAX_AGE_FILTER}
        onChange={(_e, next) => setDraft(next as [number, number])}
        onChangeCommitted={(_e, next) => commit(next as [number, number])}
        aria-labelledby="demographic-age-slider"
      />
      <TextField
        value={current[1]}
        size="small"
        onChange={(e) =>
          setDraft([current[0], e.target.value === "" ? 0 : Number(e.target.value)])
        }
        onBlur={() => commit(current)}
        onKeyDown={(e) => e.key === "Enter" && commit(current)}
        slotProps={{ htmlInput: numberInputProps }}
        sx={numberFieldSx}
      />
    </Stack>
  );
};

export default DemographicAgeSelector;
