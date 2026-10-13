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
import branding from "@branding/branding.config";
import {
  methodsStackSx,
  providersGridSx,
  rootSx,
  secondaryTextSx,
  welcomeHeadingSx,
} from "./LoginOptions.styles";

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
    <Box sx={rootSx(visible)}>
      <Stack spacing={3} sx={methodsStackSx}>
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

          <Typography variant="h3" sx={welcomeHeadingSx}>
            Welcome back.
          </Typography>
          <Typography sx={secondaryTextSx}>
            Sign in to your {branding.productName} workspace.
          </Typography>
        </Box>

        {hasNoMethods && (
          <Typography sx={secondaryTextSx}>
            We couldn&apos;t load the sign-in options. Refresh the page to try
            again, or contact your administrator if this keeps happening.
          </Typography>
        )}

        {passwordMethod && <LoginForm returnTo={returnTo} />}

        {passwordMethod && providers.length > 0 && (
          <Divider sx={{ color: "text.secondary" }}>or</Divider>
        )}

        {providers.length > 0 && (
          <Box sx={providersGridSx(providers.length > 1)}>
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
