"use client";

import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StandaloneLoginForm from "./StandaloneLoginForm";
import Circles from "./Circles";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { signIn } from "next-auth/react";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;

interface LoginClientProps {
  oidcEnabled: boolean;
}

const LoginClient = ({ oidcEnabled }: LoginClientProps) => {
  const { isStandalone } = useApplicationMode();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const onClick = async () => {
    if (oidcEnabled) {
      await signIn("oidc", { callbackUrl: "/" });
      return;
    }

    if (!isStandalone) {
      router.push(REDIRECT_URL || "");
      return;
    }
    setShowForm(true);
  };

  if (showForm) {
    return (
      <StandaloneLoginForm
        onCancel={() => setShowForm(false)}
        sx={{
          minWidth: 400,
          maxWidth: 500,
        }}
      />
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
