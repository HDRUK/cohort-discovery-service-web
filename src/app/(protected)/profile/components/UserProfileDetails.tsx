"use client";

import { Avatar, Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import dayjs from "dayjs";
import { CombinedUser } from "@/types/api";
import { checkHasNhsSdeAccess, checkIsAdmin } from "@/utils/user";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field = ({ label, children }: FieldProps) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body2" component="div">
      {children}
    </Typography>
  </Box>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1.5, color: "secondaryBlack.main" }}>
      {title}
    </Typography>
    <Grid container spacing={2.5}>
      {children}
    </Grid>
  </Box>
);

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const UserProfileDetails = ({ user }: { user: CombinedUser }) => {
  const isAdmin = checkIsAdmin(user);
  const hasNhsSdeAccess = checkHasNhsSdeAccess(user);

  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
          {getInitials(user.name)}
        </Avatar>
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
                  <Chip color="secondary" key={wg.id} size="small" label={wg.name} />
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
            {user.created_at ? dayjs(user.created_at).format("MMM D, YYYY") : "—"}
          </Field>
        </Grid>
        <Grid size={6}>
          <Field label="Last updated">
            {user.updated_at ? dayjs(user.updated_at).format("MMM D, YYYY HH:mm") : "—"}
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
