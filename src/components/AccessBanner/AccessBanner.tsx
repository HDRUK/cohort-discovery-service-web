"use client";

import { Button, Stack, Typography } from "@mui/material";
import InfoBanner from "@/components/InfoBanner";
import useFeatures from "@/hooks/useFeatures";
import useUserStore from "@/hooks/useUserStore";
import { useAccessBannerStore } from "@/store/accessBannerStore";
import { DEFAULT_ACCESS_BANNER_AUTO_HIDE } from "@/config/defaults";

const BANNER_LABEL = "New!";
const BANNER_HEADING = "Optional NHS Research SDE Cohort";
const BANNER_MESSAGE =
  "Additional datasets are available but require you go to through a separate approval process.";
const BANNER_CTA_LABEL = "Apply for Data Access";
// Same Gateway base as the header's profile link, so the two stay in step.
const GATEWAY_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org";
const BANNER_CTA_URL = `${GATEWAY_URL}/account/profile/cohort-discovery-request`;

/**
 * Promotes SDE data access to signed in users, linking them to the Gateway
 * page where that access is requested.
 *
 * Closing it — via the X, the call to action, or the auto close timer — is
 * remembered in sessionStorage, so it reappears on the next sign in.
 */
const AccessBanner = () => {
  const { accessBanner: accessBannerEnabled } = useFeatures();
  const user = useUserStore((s) => s.user);
  const dismissed = useAccessBannerStore((s) => s.dismissed);
  const dismiss = useAccessBannerStore((s) => s.dismiss);

  if (!accessBannerEnabled || !user) return null;

  return (
    <InfoBanner
      // GAT-Color/Purple/900, straight from the shared library's theme.
      backgroundColor="tertiary.midnightBlue.main"
      textColor="tertiary.midnightBlue.contrastText"
      open={!dismissed}
      // Ignoring "clickaway" stops a click anywhere on the page from
      // dismissing the banner; "timeout" is the auto close firing.
      onClose={(_event, reason) => reason !== "clickaway" && dismiss()}
      onCloseButtonClick={dismiss}
      autoHideDuration={DEFAULT_ACCESS_BANNER_AUTO_HIDE}
      ariaCloseButtonLabel="Close access banner"
      action={
        <Button
          variant="contained"
          href={BANNER_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          disableElevation
          sx={{
            bgcolor: "grey.300",
            color: "text.primary",
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "grey.400" },
          }}
        >
          {BANNER_CTA_LABEL}
        </Button>
      }
      message={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          useFlexGap
          flexWrap="wrap"
        >
          <Typography
            component="span"
            fontWeight={700}
            sx={{ color: "yellowCustom.main" }}
          >
            {BANNER_LABEL}
          </Typography>
          <Typography component="span" fontWeight={600}>
            {BANNER_HEADING}
          </Typography>
          <Typography component="span">{BANNER_MESSAGE}</Typography>
        </Stack>
      }
    />
  );
};

export default AccessBanner;
