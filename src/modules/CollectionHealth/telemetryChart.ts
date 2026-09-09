import { useTheme } from "@mui/material/styles";

export const STALE_TIME_TELEMETRY = 60_000;

export const useSeriesColours = (): string[] => {
  const theme = useTheme();
  return theme.palette.chart.series;
};
