"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

const LoginClient = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(GATEWAY_URL || "/")}
      variant="contained"
      color="secondary"
    >
      Sign in
    </Button>
  );
};

export default LoginClient;
