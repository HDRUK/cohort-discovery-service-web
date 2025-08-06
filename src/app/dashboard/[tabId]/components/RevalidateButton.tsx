"use client";

import { IconButton, Tooltip, Typography, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { revalidateAction } from "@/actions/revalidate";

interface RevalidateButtonProps {
  tag: string;
  text?: string;
}

export const RevalidateButton = ({ tag, text }: RevalidateButtonProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title="Refresh">
        <IconButton onClick={() => revalidateAction(tag)}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      {text && <Typography variant="body2">{text}</Typography>}
    </Box>
  );
};
