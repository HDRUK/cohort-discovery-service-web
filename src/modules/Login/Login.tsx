"use client";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthMethod } from "@/types/api";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import useLoginStage from "./useLoginStage";
import LoginLanding from "./LoginLanding";
import LoginBrandPanel from "./LoginBrandPanel";
import LoginOptions from "./LoginOptions";
import { PANEL_INSET, TRANSITION_DELAY_MS } from "./loginStyles";

const GATEWAY_LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

export interface LoginProps {
  methods?: AuthMethod[];
  returnTo: string;
  copyrightYear: number;
}

const Login = ({ methods = [], returnTo, copyrightYear }: LoginProps) => {
  const { isStandalone } = useApplicationMode();
  const router = useRouter();
  const { showLanding, isAuth, showForm, toAuth, toLanding } = useLoginStage();

  const onSignIn = () => {
    if (!isStandalone) {
      router.push(GATEWAY_LOGIN_URL || "");
      return;
    }

    toAuth();
  };

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        bgcolor: isAuth ? "common.white" : "secondary.main",
        transition: theme.transitions.create("background-color", {
          duration: 700,
          easing: theme.transitions.easing.easeInOut,
          delay: TRANSITION_DELAY_MS,
        }),
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      })}
    >
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          left: theme.spacing(PANEL_INSET),
          right: theme.spacing(PANEL_INSET),
          bottom: theme.spacing(PANEL_INSET),
          top: 0,
          bgcolor: "common.white",
          pointerEvents: "none",
          zIndex: 0,
          opacity: isAuth ? 0 : 1,
          transition: theme.transitions.create("opacity", {
            duration: 600,
            easing: theme.transitions.easing.easeInOut,
            delay: TRANSITION_DELAY_MS,
          }),
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        })}
      />

      <LoginBrandPanel isAuth={isAuth} showForm={showForm} />

      <LoginLanding visible={showLanding} onSignIn={onSignIn} />

      {isStandalone && (
        <LoginOptions
          methods={methods}
          returnTo={returnTo}
          copyrightYear={copyrightYear}
          visible={showForm}
          onBack={toLanding}
        />
      )}
    </Box>
  );
};

export default Login;
