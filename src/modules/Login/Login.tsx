"use client";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthMethod } from "@/types/api";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import useLoginStage from "./useLoginStage";
import LoginLanding from "./LoginLanding";
import LoginBrandPanel from "./LoginBrandPanel";
import LoginOptions from "./LoginOptions";
import { rootSx, whiteOverlaySx } from "./Login.styles";

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
    <Box sx={rootSx(isAuth)}>
      <Box aria-hidden sx={whiteOverlaySx(isAuth)} />

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
