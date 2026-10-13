import { SxProps, Theme } from "@mui/material/styles";
import { FADE_MS } from "./loginStyles";

export const rootSx = (visible: boolean): SxProps<Theme> => ({
  position: "absolute",
  inset: 0,
  zIndex: 8,
  px: 3,
  textAlign: { xs: "center", md: "left" },
  opacity: visible ? 1 : 0,
  visibility: visible ? "visible" : "hidden",
  transition: `opacity ${FADE_MS}ms ease-in-out, visibility ${FADE_MS}ms`,
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

export const headingSx: SxProps<Theme> = {
  fontSize: "clamp(2rem, 3.7vw, 3.3rem)",
  lineHeight: 1.2,
  color: "text.primary",
  fontWeight: 600,
};

export const ctaButtonSx: SxProps<Theme> = {
  borderRadius: 9999,
  px: 3,
  py: 1,
  fontSize: "clamp(1.25rem, 2vw, 2rem)",
  lineHeight: 1.2,
};
