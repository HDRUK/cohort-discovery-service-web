"use client";

import {
  IconButton,
  Typography,
  Box,
  IconButtonProps,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";

const isProd = process.env.NODE_ENV === "production";

export interface RefreshButtonProps extends Omit<IconButtonProps, "onClick"> {
  showTooltip?: boolean;
  label?: string;
  text?: string;
  onRefreshed?: () => Promise<void> | void;
}

const RefreshButton = ({
  label = "Refresh",
  text,
  showTooltip = false,
  onRefreshed,
  ...rest
}: RefreshButtonProps) => {
  const router = useRouter();
  const title = !isProd || showTooltip ? label : null;
  return (
    <Tooltip title={title}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            router.refresh();
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
