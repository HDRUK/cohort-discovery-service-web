"use client";

import { Button, Stack, Typography } from "@mui/material";
import InfoBanner from "@/components/InfoBanner";
import useFeatures from "@/hooks/useFeatures";
import useUserStore from "@/hooks/useUserStore";
import { useUiPreferences } from "@/store/uiPreferencesStore";
import { DEFAULT_ACCESS_BANNER_AUTO_HIDE } from "@/config/defaults";
import { checkHasNhsSdeAccess } from "@/utils/user";

const BANNER_LABEL = "New!";
const BANNER_HEADING = "Optional NHS Research SDE Cohort";
const BANNER_MESSAGE =
  "Additional datasets are available but require you go to through a separate approval process.";
const BANNER_CTA_LABEL = "Apply for Data Access";
const GATEWAY_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org";
const BANNER_CTA_URL = `${GATEWAY_URL}/account/profile/cohort-discovery-request`;

const AccessBanner = () => {
  const { accessBanner: accessBannerEnabled } = useFeatures();
  const user = useUserStore((s) => s.user);
  const dismissed = useUiPreferences((s) => s.dismissed.accessBanner);
  const dismiss = useUiPreferences((s) => s.dismiss);
  const dismissBanner = () => dismiss("accessBanner");

  if (!accessBannerEnabled || !user || checkHasNhsSdeAccess(user)) return null;

  return (
    <InfoBanner
      backgroundColor="tertiary.midnightBlue.main"
      textColor="tertiary.midnightBlue.contrastText"
      open={!dismissed}
      onClose={(_event, reason) => reason !== "clickaway" && dismissBanner()}
      onCloseButtonClick={dismissBanner}
      autoHideDuration={DEFAULT_ACCESS_BANNER_AUTO_HIDE}
      ariaCloseButtonLabel="Close access banner"
      action={
        <Button
          variant="contained"
          href={BANNER_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismissBanner}
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
