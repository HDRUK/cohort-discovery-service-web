"use client";

import List from "@/components/List";
import { isStandalone } from "@/utils/modes";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const NEXT_PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://www.hdruk.ac.uk/";
const applicationMode = process.env.APPLICATION_MODE;

export default function Custom403() {
  const params = useSearchParams();
  const reason = params.get("reason");

  const getMessages = (): string[] => {
    switch (reason) {
      case "missing-role":
        return [
          "You do not have the required role to access this page.",
          "If you believe this is a mistake, contact your team administrator.",
          "If you’ve just been granted access, try signing out and back in.",
        ];

      case "no-token":
        return [
          "Your session is invalid or missing.",
          "This can happen if you opened the link in a new browser or after a long time.",
          "Please sign in again to continue.",
        ];

      case "expired-token":
        return [
          "Your session has expired.",
          "For security reasons you’ve been signed out.",
          "Please sign in again to continue.",
        ];

      default:
        return [
          "You do not have permission to access this page.",
          "If you believe this is a mistake, contact support.",
        ];
    }
  };

  const redirectUrl = isStandalone(applicationMode)
    ? "/"
    : NEXT_PUBLIC_LOGIN_URL;

  const messages = getMessages();

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "100px auto" }}>
      <Typography variant="h3" color="error.main" gutterBottom>
        403 — Forbidden
      </Typography>

      <List
        component="ul"
        sx={{
          listStyleType: "disc",
          pl: 4, // indentation
          "& .MuiListItem-root": { display: "list-item" }, // allow markers
        }}
        items={messages.map((msg, i) => ({ value: i, label: msg }))}
      />

      <Stack>
        <Button
          variant="outlined"
          component={Link}
          href={redirectUrl}
          sx={{ mx: "auto" }}
        >
          Return Home
        </Button>
      </Stack>
    </Paper>
  );
}
