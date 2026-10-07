import { SxProps, Theme } from "@mui/material/styles";
import {
  AUTH_CIRCLE_DIAMETER,
  BRAND_PANEL_WIDTH,
  FADE_MS,
  PANEL_INSET,
  TRANSITION_DELAY_MS,
  TRANSITION_MS,
} from "./loginStyles";

export const panelSx =
  (isAuth: boolean): SxProps<Theme> =>
  (theme) => ({
    position: "absolute",
    left: theme.spacing(PANEL_INSET),
    top: theme.spacing(PANEL_INSET),
    bottom: theme.spacing(PANEL_INSET),
    width: isAuth
      ? `calc(${BRAND_PANEL_WIDTH} - ${theme.spacing(PANEL_INSET)})`
      : 0,
    bgcolor: "sage.main",
    overflow: "hidden",
    zIndex: 1,
    transition: theme.transitions.create("width", {
      duration: TRANSITION_MS,
      easing: theme.transitions.easing.easeInOut,
      delay: TRANSITION_DELAY_MS,
    }),
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  });

export const panelTextWrapperSx = (showForm: boolean): SxProps<Theme> => ({
  position: "absolute",
  left: 48,
  right: 32,
  bottom: 56,
  opacity: showForm ? 1 : 0,
  transition: `opacity ${FADE_MS}ms ease-in-out`,
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

export const panelHeadingSx: SxProps<Theme> = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  lineHeight: 1.15,
  fontSize: "clamp(1.375rem, 2.6vw, 2.625rem)",
  color: "text.primary",
  mb: 2,
};

export const panelSubheadingSx: SxProps<Theme> = {
  fontSize: 19,
  lineHeight: 1.45,
  color: "text.primary",
};

export const circlesPositionSx =
  (isAuth: boolean): SxProps<Theme> =>
  (theme) => ({
    position: "absolute",
    left: isAuth ? "29vw" : "50%",
    top: isAuth ? "39%" : "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 6,
    transition: theme.transitions.create(["left", "top"], {
      duration: TRANSITION_MS,
      easing: theme.transitions.easing.easeInOut,
      delay: TRANSITION_DELAY_MS,
    }),
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  });

export const fingerprintWrapperSx = (showForm: boolean): SxProps<Theme> => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: AUTH_CIRCLE_DIAMETER,
  height: AUTH_CIRCLE_DIAMETER,
  zIndex: 10,
  opacity: showForm ? 1 : 0,
  transition: `opacity ${FADE_MS}ms ease-in-out`,
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

export const fingerprintIconSx: SxProps<Theme> = {
  width: "78%",
  height: "78%",
  color: "common.white",
  strokeWidth: 0.6,
  stroke: "currentColor",
};
