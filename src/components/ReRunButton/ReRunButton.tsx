"use client";

import {
  IconButton,
  Typography,
  Box,
  IconButtonProps,
  Tooltip,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

const isProd = process.env.NODE_ENV === "production";

export interface ReRunButtonProps extends Omit<IconButtonProps, "onClick"> {
  tag?: string;
  showTooltip?: boolean;
  label?: string;
  text?: string;
  onClick: () => void;
}

const ReRunButton = ({
  tag,
  label,
  text,
  onClick,
  showTooltip = false,
  ...rest
}: ReRunButtonProps) => {
  const title = !isProd || showTooltip ? label : null;
  return (
    <Tooltip title={title}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onClick} {...rest}>
          <CachedIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </Tooltip>
  );
};

export default ReRunButton;
