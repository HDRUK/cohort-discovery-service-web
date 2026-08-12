"use client";

import { Close } from "@mui/icons-material";
import { IconButton, Snackbar, SnackbarProps } from "@mui/material";

export interface InfoBannerProps extends Omit<SnackbarProps, "color"> {
  /**
   * Theme palette paths, resolved by MUI's sx. Paths rather than the Gateway's
   * palette key, so nested brand tokens like "tertiary.midnightBlue.main" are
   * reachable — a plain key only reaches the top level of the palette.
   */
  backgroundColor?: string;
  textColor?: string;
  ariaCloseButtonLabel: string;
  isDismissable?: boolean;
  onCloseButtonClick?: () => void;
}

/**
 * A full width, in-flow page banner. Ported from the Gateway's InfoBanner so
 * the two apps stay visually consistent until a shared component exists in
 * @hdruk/ui. `open` is controlled by the caller (the Gateway version holds it
 * internally) so that dismissal can be persisted.
 */
const InfoBanner = ({
  sx,
  backgroundColor = "secondary.main",
  textColor = "secondary.contrastText",
  action,
  // "left" rather than the Gateway's "center": the centre variant positions
  // itself with translateX(-50%), which survives `position: static` below and
  // drags a full width banner half off screen.
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
      // backgroundColor, not background — only the former is resolved against
      // the theme palette by sx.
      sx: { backgroundColor, color: textColor },
    }}
    anchorOrigin={anchorOrigin}
    sx={{
      // Take the Snackbar out of its fixed overlay so it sits in the page
      // flow as a banner rather than floating over the content.
      position: "static",
      // A centred Snackbar is normally positioned with left: 50% plus
      // translateX(-50%). Going static cancels the offsets but not the
      // transform, which would drag the full width banner half off screen.
      transform: "none",
      // Snackbars sit at zIndex 1400, above modals at 1300. z-index is
      // normally ignored on a static element, but this banner is a flex item
      // of the page layout, and flex items honour it — so without this the
      // banner paints over dialog backdrops and dropdown menus.
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
