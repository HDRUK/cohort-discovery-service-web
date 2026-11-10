"use client";

import List from "@/components/List";
import { ListItemType } from "@/components/List/ListItem";
import { isStandalone } from "@/utils/modes";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getContent } from "./custom403Content";
import { getOrganisationUrl } from "@/config/externalLinks";
import { signInUrl } from "./signInUrl";

const ORGANISATION_URL = getOrganisationUrl();
const applicationMode = process.env.APPLICATION_MODE;

export default function Custom403({ reason }: { reason?: string }) {
  const params = useSearchParams();

  const standalone = isStandalone(applicationMode);
  const { messages, redirectUrl } = getContent(
    reason ?? params.get("reason"),
    standalone,
    ORGANISATION_URL,
    signInUrl(standalone, process.env.NEXT_PUBLIC_LOGIN_URL),
  );

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "100px auto" }}>
      <Typography variant="h3" color="error.main" gutterBottom>
        403 — Forbidden
      </Typography>

      <List
        bulleted
        items={messages.map(
          (msg, i) =>
            ({
              id: i,
              label: msg,
              slotProps: {
                primary: {
                  fontWeight: "bold",
                },
              },
            }) satisfies ListItemType,
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
