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
  tag: string | string[];
  showTooltip?: boolean;
  label?: string;
  text?: string;
  onRefreshed?: () => Promise<void> | void;
}

const RefreshButton = ({
  tag,
  label,
  text,
  showTooltip = false,
  onRefreshed,
  ...rest
}: RefreshButtonProps) => {
  const tags = Array.isArray(tag) ? tag : [tag];
  const uniqueTags = [...new Set(tags)];
  const title = !isProd || showTooltip ? (label ?? tag) : null;
  return (
    <Tooltip title={title}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await Promise.all(uniqueTags.map((t) => revalidateAction(t)));
            await onRefreshed?.();
          }}
          {...rest}
        >
          <RefreshIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </Tooltip>
  );
};

export default RefreshButton;
