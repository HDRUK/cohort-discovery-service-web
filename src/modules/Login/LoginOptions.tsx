"use client";

import { useState } from "react";
import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { AuthMethod } from "@/types/api";
import { getProviderIcon } from "@/utils/ssoProviders";
import { getLegalLinks } from "@/config/externalLinks";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { partitionAuthMethods } from "./authMethods";
import LoginForm from "./LoginForm";
import { BRAND_PANEL_WIDTH, FADE_MS } from "./loginStyles";
import branding from "@branding/branding.config";

interface LoginOptionsProps {
  methods: AuthMethod[];
  returnTo: string;
  copyrightYear: number;
  visible: boolean;
  onBack: () => void;
}

const LoginOptions = ({
  methods,
  returnTo,
  copyrightYear,
  visible,
  onBack,
}: LoginOptionsProps) => {
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);
  const { isStandalone } = useApplicationMode();
  const legalLinks = getLegalLinks(isStandalone);
  const { passwordMethod, providers } = partitionAuthMethods(methods);
  const hasNoMethods = !passwordMethod && providers.length === 0;

  return (
    <Box
      sx={{
        position: "absolute",
        left: { xs: 0, md: BRAND_PANEL_WIDTH },
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 9,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflowY: "auto",
        pt: 8,
        pb: 4,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        transition: `opacity ${FADE_MS}ms ease-in-out, visibility ${FADE_MS}ms`,
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          flex: 1,
          justifyContent: "center",
          width: "100%",
          maxWidth: 472,
          px: 8,
        }}
      >
        <Box>
          <Button
            onClick={onBack}
            variant="text"
            color="secondary"
            startIcon={<ArrowBackRounded />}
            size="small"
            sx={{ ml: -1, mb: 1 }}
          >
            Back
          </Button>

          <Typography
            variant="h3"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            Welcome back.
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Sign in to your {branding.productName} workspace.
          </Typography>
        </Box>

        {hasNoMethods && (
          <Typography sx={{ color: "text.secondary" }}>
            We couldn&apos;t load the sign-in options. Refresh the page to try
            again, or contact your administrator if this keeps happening.
          </Typography>
        )}

        {passwordMethod && <LoginForm returnTo={returnTo} />}

        {passwordMethod && providers.length > 0 && (
          <Divider sx={{ color: "text.secondary" }}>or</Divider>
        )}

        {providers.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: providers.length > 1 ? "1fr 1fr" : "1fr",
              gap: 1,
            }}
          >
            {providers.map((provider) => {
              const ProviderIcon = getProviderIcon(provider.slug);

              return (
                <Button
                  key={provider.slug}
                  component="a"
                  href={provider.redirect_url}
                  variant="outlined"
                  color="secondary"
                  loading={redirectingTo === provider.slug}
                  startIcon={<ProviderIcon />}
                  aria-disabled={redirectingTo !== null}
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    if (redirectingTo !== null) {
                      event.preventDefault();
                      return;
                    }
                    setRedirectingTo(provider.slug);
                  }}
                >
                  {provider.label}
                </Button>
              );
            })}
          </Box>
        )}
      </Stack>

      <Stack spacing={1} alignItems="center" sx={{ flexShrink: 0, px: 8 }}>
        <Stack direction="row" spacing={3}>
          <Link href={legalLinks.privacyPolicy} variant="caption">
            Privacy policy
          </Link>
          <Link href={legalLinks.termsAndConditions} variant="caption">
            Terms of use
          </Link>
        </Stack>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          © {copyrightYear} {branding.copyrightHolder}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginOptions;
