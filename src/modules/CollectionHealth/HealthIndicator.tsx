"use client";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, SvgIconProps, Tooltip, Typography } from "@mui/material";
import { HealthCheck, HealthLevel } from "./health";

const ICONS: Record<
  HealthLevel,
  { Icon: React.ComponentType<SvgIconProps>; color: SvgIconProps["color"] }
> = {
  ok: { Icon: CheckCircleIcon, color: "success" },
  warn: { Icon: WarningAmberIcon, color: "warning" },
  fail: { Icon: CancelIcon, color: "error" },
  none: { Icon: RemoveCircleOutlineIcon, color: "disabled" },
};

export const HealthIcon = ({
  level,
  fontSize = "small",
}: {
  level: HealthLevel;
  fontSize?: SvgIconProps["fontSize"];
}) => {
  const { Icon, color } = ICONS[level];
  return <Icon color={color} fontSize={fontSize} />;
};

const HealthIndicator = ({ check }: { check: HealthCheck }) => (
  <Tooltip title={`${check.label} — ${check.detail}`}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <HealthIcon level={check.level} />
      <Typography variant="caption" color="text.secondary" noWrap>
        {check.value}
      </Typography>
    </Box>
  </Tooltip>
);

export default HealthIndicator;
