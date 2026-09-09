"use client";

import { Box, Stack, Typography } from "@mui/material";
import { DASH_PATTERN } from "./chartAxis";

export interface ChartLegendEntry {
  key: string;
  label: string;
  colour: string;
}

export interface ChartLegendProps {
  entries: ChartLegendEntry[];
  solidLabel?: string;
  dashedLabel?: string;
}

const SWATCH_WIDTH = 18;

const Swatch = ({ dashed }: { dashed?: boolean }) => (
  <Box
    component="svg"
    width={SWATCH_WIDTH}
    height={8}
    sx={{ flex: "0 0 auto", color: "text.secondary" }}
    aria-hidden
  >
    <line
      x1={0}
      y1={4}
      x2={SWATCH_WIDTH}
      y2={4}
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray={dashed ? DASH_PATTERN : undefined}
    />
  </Box>
);

const ChartLegend = ({
  entries,
  solidLabel,
  dashedLabel,
}: ChartLegendProps) => (
  <Stack
    direction="row"
    spacing={1.5}
    sx={{ flexWrap: "wrap", rowGap: 0.5, alignItems: "center" }}
  >
    {entries.map((entry) => (
      <Stack
        key={entry.key}
        direction="row"
        spacing={0.75}
        sx={{ alignItems: "center", minWidth: 0 }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: entry.colour,
            flex: "0 0 auto",
          }}
        />
        <Typography variant="caption" color="text.secondary" noWrap>
          {entry.label}
        </Typography>
      </Stack>
    ))}

    {solidLabel && dashedLabel && (
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", ml: "auto" }}
      >
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Swatch />
          <Typography variant="caption" color="text.secondary">
            {solidLabel}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Swatch dashed />
          <Typography variant="caption" color="text.secondary">
            {dashedLabel}
          </Typography>
        </Stack>
      </Stack>
    )}
  </Stack>
);

export default ChartLegend;
