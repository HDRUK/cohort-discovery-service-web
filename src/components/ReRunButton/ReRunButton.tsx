"use client";

import {
  IconButton,
  Box,
  IconButtonProps,
  Tooltip,
  Button,
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
        {text ? (
          <Button
            variant="text"
            startIcon={<CachedIcon fontSize={"small"} />}
            onClick={onClick}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
            }}
            {...rest}
          >
            {text}
          </Button>
        ) : (
          <IconButton onClick={onClick} {...rest}>
            <CachedIcon fontSize={"small"} />
          </IconButton>
        )}
      </Box>
    </Tooltip>
  );
};

export default ReRunButton;
