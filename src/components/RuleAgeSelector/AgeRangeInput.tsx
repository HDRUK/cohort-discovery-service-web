"use client";

import { useMemo, useState } from "react";
import { Slider, Stack, SxProps, TextField, Theme } from "@mui/material";

export interface AgeRangeInputProps {
  value: [number, number];
  minAge: number;
  maxAge: number;
  onChange: (value: [number, number]) => void;
  uniDirectional?: boolean;
  sx?: SxProps<Theme>;
}

const AGE_SLIDER_LABEL_ID = "age-range-slider";

const numberFieldSx = {
  maxWidth: "7ch",
  flexShrink: 0,
  "& .MuiOutlinedInput-root": { borderRadius: 1 },
};

const normalise = (
  [l, r]: [number, number],
  minAge: number,
  maxAge: number,
): [number, number] => [
  Math.max(minAge, Math.min(l, r)),
  Math.min(maxAge, Math.max(l, r)),
];

/**
 * Controlled two-input + range-slider age picker. Presentational only: it emits
 * a clamped, ordered [low, high] pair via onChange and holds no store or rule
 * state, so it can back both the query-builder age rule and the demographics
 * panel.
 */
const AgeRangeInput = ({
  value,
  minAge,
  maxAge,
  onChange,
  uniDirectional = false,
  sx = { py: 2 },
}: AgeRangeInputProps) => {
  const [draft, setDraft] = useState<[number, number] | null>(null);
  const current = draft ?? value;

  const numberInputProps = useMemo(
    () => ({
      step: 1,
      min: minAge,
      max: maxAge,
      type: "number",
      "aria-labelledby": AGE_SLIDER_LABEL_ID,
      sx: { p: 0.5 },
    }),
    [minAge, maxAge],
  );

  const commit = (next: [number, number]) => {
    setDraft(null);
    onChange(normalise(next, minAge, maxAge));
  };

  const handleSliderChange = (
    _e: Event,
    next: number | number[],
    activeThumb: number,
  ) => {
    const [l, r] = next as number[];
    setDraft(
      uniDirectional
        ? activeThumb === 0
          ? [l, maxAge]
          : [minAge, r]
        : [l, r],
    );
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={sx}>
      <TextField
        value={current[0]}
        size="small"
        onChange={(e) =>
          setDraft([
            e.target.value === "" ? 0 : Number(e.target.value),
            current[1],
          ])
        }
        onBlur={() => commit(current)}
        onKeyDown={(e) => e.key === "Enter" && commit(current)}
        slotProps={{ htmlInput: numberInputProps }}
        sx={numberFieldSx}
      />
      <Slider
        value={current}
        min={minAge}
        max={maxAge}
        onChange={handleSliderChange}
        onChangeCommitted={() => commit(current)}
        aria-labelledby={AGE_SLIDER_LABEL_ID}
      />
      <TextField
        value={current[1]}
        size="small"
        onChange={(e) =>
          setDraft([
            current[0],
            e.target.value === "" ? 0 : Number(e.target.value),
          ])
        }
        onBlur={() => commit(current)}
        onKeyDown={(e) => e.key === "Enter" && commit(current)}
        slotProps={{ htmlInput: numberInputProps }}
        sx={numberFieldSx}
      />
    </Stack>
  );
};

export default AgeRangeInput;
