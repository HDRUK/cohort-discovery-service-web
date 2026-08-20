"use client";

import { Close } from "@mui/icons-material";
import { IconButton, Snackbar, SnackbarProps } from "@mui/material";

// This component was ported from Gateway, and is a candidate for the shared
// component library once that exists.
// There's a caveat here as `open` is controlled by the parent (AccessBanner),
// not interanlly like Gateway's version, since we need to persist the dismissal
// state in the store.

export interface InfoBannerProps extends SnackbarProps {
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
