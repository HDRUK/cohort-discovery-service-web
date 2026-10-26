import { SxProps, Theme } from "@mui/material/styles";
import { BRAND_PANEL_WIDTH, FADE_MS } from "./loginStyles";

export const rootSx = (visible: boolean): SxProps<Theme> => ({
  position: "absolute",
  left: { xs: 0, md: BRAND_PANEL_WIDTH },
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 9,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  overflowY: "auto",
  pt: 8,
  pb: 4,
  opacity: visible ? 1 : 0,
  visibility: visible ? "visible" : "hidden",
  transition: `opacity ${FADE_MS}ms ease-in-out, visibility ${FADE_MS}ms`,
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

export const methodsStackSx: SxProps<Theme> = {
  flex: 1,
  justifyContent: "center",
  width: "100%",
  maxWidth: 472,
  px: 8,
};

export const welcomeHeadingSx: SxProps<Theme> = {
  color: "text.primary",
  fontWeight: 600,
};

export const secondaryTextSx: SxProps<Theme> = {
  color: "text.secondary",
};

export const providersGridSx = (hasMultiple: boolean): SxProps<Theme> => ({
  display: "grid",
  gridTemplateColumns: hasMultiple ? "1fr 1fr" : "1fr",
  gap: 1,
});
