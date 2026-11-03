import { useTheme } from "@mui/material/styles";

export const CHART_HEIGHT = 170;

export const X_AXIS_HEIGHT = 30;

export const Y_AXIS_WIDTH = 52;

export const STALE_TIME_TELEMETRY = 60_000;

export const useSeriesColours = (): string[] => {
  const theme = useTheme();
  return theme.palette.chart.series;
};
