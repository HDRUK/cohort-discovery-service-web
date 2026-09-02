/** Geometry and colour shared by the telemetry plots, so they stay aligned. */

// The plots sit beside the collection details rather than under them, so they
// are sized to fit the row without pushing it open.
export const CHART_HEIGHT = 170;

export const X_AXIS_HEIGHT = 30;

// Every plot reserves the same y-axis band, so their plot areas start at the
// same x and the time axes line up whichever way the charts wrap.
export const Y_AXIS_WIDTH = 52;

// Categorical slots 1-3 of the validated palette. These are identities, not
// states, so they deliberately avoid the page's status green/amber/red.
export const SERIES_A_COLOUR = "#2a78d6";
export const SERIES_B_COLOUR = "#eb6834";
export const SERIES_C_COLOUR = "#1baf7a";

// Task type is the identity every task plot is coloured by, indexed by the
// type's position in the sorted group list. A-type takes the same blue the ping
// chart gives it, so a hue means the same thing across the whole panel.
export const TASK_TYPE_COLOURS = [
  SERIES_A_COLOUR,
  SERIES_B_COLOUR,
  SERIES_C_COLOUR,
];
