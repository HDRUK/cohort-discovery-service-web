"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Fingerprint from "@mui/icons-material/Fingerprint";
import Circles from "@/components/Circles";
import branding from "@branding/branding.config";
import { AUTH_CIRCLE_DIAMETER, LANDING_CIRCLE_DIAMETER } from "./loginStyles";
import {
  circlesPositionSx,
  fingerprintIconSx,
  fingerprintWrapperSx,
  panelHeadingSx,
  panelSubheadingSx,
  panelSx,
  panelTextWrapperSx,
} from "./LoginBrandPanel.styles";

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
      <Box aria-hidden sx={panelSx(isAuth)}>
        <Box sx={panelTextWrapperSx(showForm)}>
          <Typography component="p" sx={panelHeadingSx}>
            {branding.loginHeadline[0]}
            <br />
            {branding.loginHeadline[1]}
          </Typography>

          <Typography sx={panelSubheadingSx}>
            {branding.loginSubheadline}
          </Typography>
        </Box>
      </Box>

      <Box aria-hidden sx={circlesPositionSx(isAuth)}>
        <Circles
          colour={
            isAuth ? theme.palette.secondary.main : theme.palette.sage.main
          }
          diameter={diameter}
          opacities={isAuth ? AUTH_OPACITIES : LANDING_OPACITIES}
        >
          <Box sx={fingerprintWrapperSx(diameter, showForm)}>
            <Fingerprint sx={fingerprintIconSx} />
          </Box>
        </Circles>
      </Box>
    </>
  );
};

export default LoginBrandPanel;
