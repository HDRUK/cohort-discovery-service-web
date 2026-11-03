import { SxProps, Theme } from "@mui/material/styles";
import { PANEL_INSET, TRANSITION_DELAY_MS } from "./loginStyles";

export const rootSx =
  (isAuth: boolean): SxProps<Theme> =>
  (theme) => ({
    position: "relative",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    bgcolor: isAuth ? "common.white" : "secondary.main",
    transition: theme.transitions.create("background-color", {
      duration: 700,
      easing: theme.transitions.easing.easeInOut,
      delay: TRANSITION_DELAY_MS,
    }),
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  });

export const whiteOverlaySx =
  (isAuth: boolean): SxProps<Theme> =>
  (theme) => ({
    position: "absolute",
    left: theme.spacing(PANEL_INSET),
    right: theme.spacing(PANEL_INSET),
    bottom: theme.spacing(PANEL_INSET),
    top: 0,
    bgcolor: "common.white",
    pointerEvents: "none",
    zIndex: 0,
    opacity: isAuth ? 0 : 1,
    transition: theme.transitions.create("opacity", {
      duration: 600,
      easing: theme.transitions.easing.easeInOut,
      delay: TRANSITION_DELAY_MS,
    }),
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  });
