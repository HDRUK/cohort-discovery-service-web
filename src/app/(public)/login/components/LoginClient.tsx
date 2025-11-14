"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

const LoginClient = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(LOGIN_URL || "/")}
      variant="contained"
      color="secondary"
    >
      Sign in
    </Button>
  );
};

export default LoginClient;
