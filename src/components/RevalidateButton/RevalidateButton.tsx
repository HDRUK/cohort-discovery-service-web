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

export interface RevalidateButtonProps
  extends Omit<IconButtonProps, "onClick"> {
  tag: string;
  text?: string;
}

export const RevalidateButton = ({
  tag,
  text,
  ...rest
}: RevalidateButtonProps) => {
  return (
    <Tooltip title={tag}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => revalidateAction(tag)} {...rest}>
          <RefreshIcon fontSize={"small"} />
        </IconButton>
        {text && <Typography variant="body2">{text}</Typography>}
      </Box>
    </Tooltip>
  );
};
