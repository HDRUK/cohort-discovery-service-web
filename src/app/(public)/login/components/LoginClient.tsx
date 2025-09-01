"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";

const LoginClient = () => {
  const {
    userData: { signIn },
  } = useDaphneStore();

  return (
    <Button onClick={() => signIn()} variant="contained" color="secondary">
      Sign in
    </Button>
  );
};

export default LoginClient;
