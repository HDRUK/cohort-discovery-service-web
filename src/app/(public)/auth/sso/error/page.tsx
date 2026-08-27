import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  provider_not_configured: "This sign-in option is not available right now.",
  invalid_state:
    "Your sign-in session expired or was already used. Please try again.",
  invalid_id_token:
    "We couldn't verify your identity with your organisation's login system.",
  account_linking_failed:
    "We couldn't verify your email address with your organisation's login system. Contact your administrator or IT support — this isn't something you can fix by retrying.",
  idp_error: "Your organisation's login system rejected the sign-in attempt.",
  invalid_callback:
    "That sign-in link is invalid. Please start again from the login page.",
  exchange_failed:
    "Your sign-in link expired or was already used. Please try signing in again.",
};

const DEFAULT_MESSAGE =
  "Something went wrong while signing you in. Please try again.";

interface SsoErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SsoErrorPage({
  searchParams,
}: SsoErrorPageProps) {
  const { error } = await searchParams;
  const message = (error && ERROR_MESSAGES[error]) || DEFAULT_MESSAGE;

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "100px auto" }}>
      <Typography variant="h3" color="error.main" gutterBottom>
        Sign-in failed
      </Typography>

      <Typography sx={{ mb: 3 }}>{message}</Typography>

      <Stack>
        <Button
          variant="outlined"
          component={Link}
          href="/login"
          sx={{ mx: "auto" }}
        >
          Back to login
        </Button>
      </Stack>
    </Paper>
  );
}
