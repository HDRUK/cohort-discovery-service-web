"use client";

import {
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StandaloneLoginForm from "./StandaloneLoginForm";
import Circles from "./Circles";
import Title from "@/components/Title";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { AuthMethod } from "@/types/api";
import { getProviderIcon } from "@/utils/ssoProviders";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;

type View = "landing" | "options" | "email";

interface LoginClientProps {
  methods?: AuthMethod[];
}

const LoginClient = ({ methods = [] }: LoginClientProps) => {
  const { isStandalone } = useApplicationMode();
  const router = useRouter();
  const [view, setView] = useState<View>("landing");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const passwordMethod = methods.find((method) => method.type === "password");
  const providers = methods.filter(
    (method): method is Extract<AuthMethod, { type: "oidc" }> =>
      method.type === "oidc",
  );

  const onClick = () => {
    if (!isStandalone) {
      router.push(REDIRECT_URL || "");
      return;
    }
    setView("options");
  };

  if (view === "email") {
    return (
      <StandaloneLoginForm
        onCancel={() => setView("options")}
        sx={{ minWidth: 320, maxWidth: 400 }}
      />
    );
  }

  if (view === "options") {
    return (
      <Paper sx={{ p: 3, minWidth: 320, maxWidth: 400 }}>
        <Stack spacing={2}>
          <Title title="Sign in" />
          <Stack spacing={1}>
            {passwordMethod && (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<MailOutlineRounded />}
                onClick={() => setView("email")}
                sx={{ justifyContent: "flex-start" }}
              >
                {passwordMethod.label}
              </Button>
            )}

            {providers.length > 0 && (
              <>
                {passwordMethod && <Divider sx={{ my: 1 }} />}
                {providers.map((provider) => {
                  const ProviderIcon = getProviderIcon(provider.slug);
                  const isLoading = loadingProvider === provider.slug;

                  return (
                    <Button
                      key={provider.slug}
                      component="a"
                      href={provider.redirect_url}
                      variant="outlined"
                      fullWidth
                      size="large"
                      aria-disabled={loadingProvider !== null}
                      onClick={(event) => {
                        if (loadingProvider !== null) {
                          event.preventDefault();
                          return;
                        }
                        setLoadingProvider(provider.slug);
                      }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <ProviderIcon />
                        )
                      }
                      sx={{ justifyContent: "flex-start" }}
                    >
                      {isLoading ? "Redirecting…" : provider.label}
                    </Button>
                  );
                })}
              </>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Circles scale={1.5}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
        Cohort Discovery{" "}
        <Typography
          component="span"
          variant="h5"
          sx={{ fontWeight: 400, color: "text.secondary" }}
        >
          Access
        </Typography>
      </Typography>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          bgcolor: "#fff",
          color: "text.primary",
          borderRadius: 10,
          minWidth: 150,
        }}
      >
        Sign in
      </Button>
    </Circles>
  );
};

export default LoginClient;
