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

export interface RevalidateButtonProps
  extends Omit<IconButtonProps, "onClick"> {
  tag: string;
  label?: string;
  text?: string;
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

export const RevalidateButton = ({
  tag,
  label,
  text,
  ...rest
}: RevalidateButtonProps) => {
  return (
    <TooltipWrapper enabled={!isProd} title={label || tag}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => revalidateAction(tag)} {...rest}>
          <RefreshIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </TooltipWrapper>
  );
};
