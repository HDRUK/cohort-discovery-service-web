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
  tag?: string;
  showTooltip?: boolean;
  label?: string;
  text?: string;
  onClick?: () => void;
}

const TooltipWrapper = ({
  enabled,
  title,
  children,
}: {
  enabled: boolean;
  title: React.ReactNode;
  children: React.ReactElement;
}) => {
  return enabled ? <Tooltip title={title}>{children}</Tooltip> : children;
};

export const RefreshButton = ({
  tag,
  label,
  text,
  onClick,
  showTooltip = false,
  ...rest
}: RefreshButtonProps) => {
  const title = label || tag;
  return (
    <TooltipWrapper enabled={(!isProd || showTooltip) && !!title} title={title}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={onClick ? onClick : () => tag && revalidateAction(tag)}
          {...rest}
        >
          <RefreshIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </TooltipWrapper>
  );
};
