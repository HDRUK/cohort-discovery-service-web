export const CHART_HEIGHT = 170;

export const X_AXIS_HEIGHT = 30;

export const Y_AXIS_WIDTH = 52;

export const TICK_FONT_SIZE = 11;

export const DASH_PATTERN = "5 4";

const TARGET_TICKS = 6;

export const tickStep = (
  binCountValue: number,
  target = TARGET_TICKS,
): number => Math.max(1, Math.ceil(binCountValue / target));
