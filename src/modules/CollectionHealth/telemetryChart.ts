import { useTheme } from "@mui/material/styles";

export const CHART_HEIGHT = 170;

export const X_AXIS_HEIGHT = 30;

export const Y_AXIS_WIDTH = 52;

const FALLBACK_SERIES = ["#2a78d6", "#eb6834", "#1baf7a"];

export const useSeriesColours = (): string[] => {
  const theme = useTheme();
  return theme.palette.chart?.series ?? FALLBACK_SERIES;
};
