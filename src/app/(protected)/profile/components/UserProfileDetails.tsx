"use client";

import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import dayjs from "dayjs";
import { CombinedUser } from "@/types/api";
import { checkHasNhsSdeAccess, checkIsAdmin } from "@/utils/user";
import Field from "./Field";
import Section from "./Section";
import UserInitials from "@/components/UserInitials";

const UserProfileDetails = ({ user }: { user: CombinedUser }) => {
  const isAdmin = checkIsAdmin(user);
  const hasNhsSdeAccess = checkHasNhsSdeAccess(user);

  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <UserInitials user={user} />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">{user.name}</Typography>
            {isAdmin && <Chip size="small" color="success" label="Admin" />}
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            {user.email_verified_at ? (
              <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
            ) : (
              <PendingIcon color="warning" sx={{ fontSize: 16 }} />
            )}
          </Stack>
        </Box>
      </Stack>

      <Divider />

      <Section title="Access">
        <Grid size={12}>
          <Field label="Roles">
            {user.roles.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {user.roles.map((r) => (
                  <Chip key={r.id} size="small" label={r.name} />
                ))}
              </Stack>
            ) : (
              "—"
            )}
          </Field>
        </Grid>
        <Grid size={12}>
          <Field label="Workgroups">
            {user.workgroups?.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {user.workgroups.map((wg) => (
                  <Chip
                    color="secondary"
                    key={wg.id}
                    size="small"
                    label={wg.name}
                  />
                ))}
              </Stack>
            ) : (
              "—"
            )}
          </Field>
        </Grid>
        <Grid size={12}>
          <Field label="Custodian teams">
            {user.custodians.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {user.custodians.map((c) => (
                  <Chip key={c.id} size="small" label={c.name} />
                ))}
              </Stack>
            ) : (
              "—"
            )}
          </Field>
        </Grid>
        <Grid size={6}>
          <Field label="NHS SDE approved">
            {hasNhsSdeAccess ? (
              <CheckCircleOutlineIcon color="success" fontSize="small" />
            ) : (
              <BlockIcon color="disabled" fontSize="small" />
            )}
          </Field>
        </Grid>
      </Section>

      <Divider />

      <Section title="Account">
        <Grid size={6}>
          <Field label="Member since">
            {user.created_at
              ? dayjs(user.created_at).format("MMM D, YYYY")
              : "—"}
          </Field>
        </Grid>
        <Grid size={6}>
          <Field label="Last updated">
            {user.updated_at
              ? dayjs(user.updated_at).format("MMM D, YYYY HH:mm")
              : "—"}
          </Field>
        </Grid>
      </Section>

      {user.token_user && (
        <>
          <Divider />
          <Section title="Current session">
            <Grid size={6}>
              <Field label="Signed in via">
                {user.token_user.sso_provider ?? "Password"}
              </Field>
            </Grid>
            {user.token_user.orcid && (
              <Grid size={6}>
                <Field label="ORCID">{user.token_user.orcid}</Field>
              </Grid>
            )}
          </Section>
        </>
      )}
    </Stack>
  );
};

export default UserProfileDetails;
