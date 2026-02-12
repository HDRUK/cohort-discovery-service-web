"use client";

import {
  IconButton,
  Typography,
  Box,
  IconButtonProps,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { revalidateAction } from "@/actions/revalidate";

const isProd = process.env.NODE_ENV === "production";

export interface RefreshButtonProps extends Omit<IconButtonProps, "onClick"> {
  tag: string;
  showTooltip?: boolean;
  label?: string;
  text?: string;
}

const RefreshButton = ({
  tag,
  label,
  text,
  showTooltip = false,
  ...rest
}: RefreshButtonProps) => {
  const title = !isProd || showTooltip ? label ?? tag : null;
  return (
    <Tooltip title={title}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => revalidateAction(tag)} {...rest}>
          <RefreshIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </Tooltip>
  );
};

export default RefreshButton;
