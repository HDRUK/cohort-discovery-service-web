"use client";

import { Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StandaloneLoginForm from "./StandaloneLoginForm";
import Circles from "./Circles";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { SsoProvider } from "@/types/api";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;

interface LoginClientProps {
  providers?: SsoProvider[];
}

const LoginClient = ({ providers = [] }: LoginClientProps) => {
  const { isStandalone } = useApplicationMode();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const onClick = () => {
    if (!isStandalone) {
      router.push(REDIRECT_URL || "");
      return;
    }
    setShowForm(true);
  };

  if (showForm) {
    return (
      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        <StandaloneLoginForm
          onCancel={() => setShowForm(false)}
          sx={{
            minWidth: 400,
            maxWidth: 500,
          }}
        />
        {providers.length > 0 && (
          <Paper sx={{ p: 2, minWidth: 250, maxWidth: 300 }}>
            <Stack spacing={1}>
              {providers.map((provider) => (
                <Button
                  key={provider.slug}
                  component="a"
                  href={provider.redirect_url}
                  variant="outlined"
                  fullWidth
                >
                  {provider.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>
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
