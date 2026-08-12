"use client";

import { Close } from "@mui/icons-material";
import { IconButton, Snackbar, SnackbarProps } from "@mui/material";

export interface InfoBannerProps extends Omit<SnackbarProps, "color"> {
  backgroundColor?: string;
  textColor?: string;
  ariaCloseButtonLabel: string;
  isDismissable?: boolean;
  onCloseButtonClick?: () => void;
}

const InfoBanner = ({
  sx,
  backgroundColor = "secondary.main",
  textColor = "secondary.contrastText",
  action,
  anchorOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  isDismissable = true,
  ariaCloseButtonLabel,
  onCloseButtonClick,
  ...restProps
}: InfoBannerProps) => (
  <Snackbar
    action={
      <>
        {action}
        {isDismissable && (
          <IconButton
            onClick={onCloseButtonClick}
            aria-label={ariaCloseButtonLabel}
          >
            <Close sx={{ color: textColor }} />
          </IconButton>
        )}
      </>
    }
    ContentProps={{
      sx: { backgroundColor, color: textColor },
    }}
    anchorOrigin={anchorOrigin}
    sx={{
      position: "static",
      transform: "none",
      zIndex: "auto",
      "> div": {
        borderRadius: 0,
        width: "100%",
      },
      ...sx,
    }}
    {...restProps}
  />
);

export default InfoBanner;
