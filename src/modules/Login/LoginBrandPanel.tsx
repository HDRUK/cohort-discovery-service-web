"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Fingerprint from "@mui/icons-material/Fingerprint";
import Circles from "@/components/Circles";
import branding from "@branding/branding.config";
import {
  AUTH_CIRCLE_DIAMETER,
  BRAND_PANEL_WIDTH,
  FADE_MS,
  LANDING_CIRCLE_DIAMETER,
  PANEL_INSET,
  TRANSITION_DELAY_MS,
  TRANSITION_MS,
} from "./loginStyles";

const LANDING_OPACITIES = [1, 0.5, 0.3];
const AUTH_OPACITIES = [0.9, 0.75, 0.6];

interface LoginBrandPanelProps {
  isAuth: boolean;
  showForm: boolean;
}

const LoginBrandPanel = ({ isAuth, showForm }: LoginBrandPanelProps) => {
  const theme = useTheme();
  const diameter = isAuth ? AUTH_CIRCLE_DIAMETER : LANDING_CIRCLE_DIAMETER;

  return (
    <>
      <Box
        aria-hidden
        sx={(theme) => ({
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
        })}
      >
        <Box
          sx={{
            position: "absolute",
            left: 48,
            right: 32,
            bottom: 56,
            opacity: showForm ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              fontSize: "clamp(1.375rem, 2.6vw, 2.625rem)",
              color: "text.primary",
              mb: 2,
            }}
          >
            {branding.loginHeadline[0]}
            <br />
            {branding.loginHeadline[1]}
          </Typography>

          <Typography
            sx={{ fontSize: 19, lineHeight: 1.45, color: "text.primary" }}
          >
            {branding.loginSubheadline}
          </Typography>
        </Box>
      </Box>

      <Box
        aria-hidden
        sx={(theme) => ({
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
        })}
      >
        <Circles
          colour={
            isAuth ? theme.palette.secondary.main : theme.palette.sage.main
          }
          diameter={diameter}
          opacities={isAuth ? AUTH_OPACITIES : LANDING_OPACITIES}
        >
          <Box
            sx={{
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
            }}
          >
            <Fingerprint
              sx={{
                width: "78%",
                height: "78%",
                color: "common.white",
                strokeWidth: 0.6,
                stroke: "currentColor",
              }}
            />
          </Box>
        </Circles>
      </Box>
    </>
  );
};

export default LoginBrandPanel;
