"use client";

import List from "@/components/List";
import { ListItemType } from "@/components/List/ListItem";
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

  const loginRedirect = isStandalone(applicationMode)
    ? "/sign-in"
    : NEXT_PUBLIC_LOGIN_URL;

  const getContent = (): { messages: string[]; redirectUrl: string } => {
    switch (reason) {
      case "missing-role":
        return {
          messages: [
            "You do not have the required role to access this page.",
            "If you believe this is a mistake, contact your team administrator.",
            "If you’ve just been granted access, try signing out and back in.",
          ],
          redirectUrl: "/dashboard",
        };

      case "no-token":
        return {
          messages: [
            "Your session is invalid or missing.",
            "This can happen if you opened the link in a new browser or after a long time.",
            "Please sign in again to continue.",
          ],
          redirectUrl: loginRedirect,
        };

      case "expired-token":
        return {
          messages: [
            "Your session has expired.",
            "For security reasons you’ve been signed out.",
            "Please sign in again to continue.",
          ],
          redirectUrl: loginRedirect,
        };

      case "no-access-custodian":
        return {
          messages: [
            "You do not have the permission to administer this custodian",
          ],
          redirectUrl: "/dashboard",
        };

      case "no-admin-access":
        return {
          messages: [
            "You do not have the permission to administer the Cohort Discovery Service",
          ],
          redirectUrl: "/dashboard",
        };

      default:
        return {
          messages: [
            "You do not have the correct permissions to access something on this page.",
            "If you believe this is a mistake, contact support.",
          ],
          redirectUrl: isStandalone(applicationMode)
            ? "/"
            : NEXT_PUBLIC_LOGIN_URL,
        };
    }
  };

  const { messages, redirectUrl } = getContent();

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "100px auto" }}>
      <Typography variant="h3" color="error.main" gutterBottom>
        403 — Forbidden
      </Typography>

      <List
        bulleted
        items={messages.map(
          (msg, i) => ({ id: i, label: msg }) satisfies ListItemType,
        )}
      />

      <Stack>
        <Button
          variant="outlined"
          component={Link}
          href={redirectUrl}
          sx={{ mx: "auto" }}
        >
          Return
        </Button>
      </Stack>
    </Paper>
  );
}
