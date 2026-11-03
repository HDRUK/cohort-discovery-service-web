"use client";

import { ReactNode } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import ChipList from "@/components/ChipList";
import UpdatePanel from "@/components/UpdatePanel";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { User } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { getProviderIcon } from "@/utils/ssoProviders";
import { formatWorkgroupName } from "@/utils/workgroups";

export interface ViewUserProps {
  user: User;
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <>
    <Grid size={4}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={8}>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {value ?? "—"}
      </Typography>
    </Grid>
  </>
);

const EmptyNote = ({ children }: { children: ReactNode }) => (
  <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
    {children}
  </Typography>
);

const ViewUser = ({ user }: ViewUserProps) => {
  const { expandedRight, toggleRight } = useThreePane();

  const identities = user.identities ?? [];
  const roles = user.roles ?? [];
  const workgroups = user.workgroups ?? [];

  return (
    <UpdatePanel
      label="User"
      expandedRight={expandedRight}
      onLockClick={toggleRight}
      onUnlockClick={toggleRight}
    >
      <ActionMenuSection title="Details" fixedExpanded defaultExpanded underline>
        <Grid container spacing={1} padding={2}>
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Created" value={getDatetime(user.created_at)} />
        </Grid>
      </ActionMenuSection>

      <ActionMenuSection title="Sign-in" fixedExpanded defaultExpanded underline>
        {identities.length ? (
          <Stack gap={1} sx={{ px: 2, py: 1 }}>
            {identities.map((identity) => {
              const ProviderIcon = getProviderIcon(identity.provider);

              return (
                <Box
                  key={identity.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ProviderIcon fontSize="small" color="action" />
                  <Typography variant="body2">{identity.provider}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    last login{" "}
                    {getDatetime(
                      identity.last_login_at ?? undefined,
                      undefined,
                      "never",
                    )}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <EmptyNote>
            No linked sign-in provider — this user signs in with a password.
          </EmptyNote>
        )}
      </ActionMenuSection>

      <ActionMenuSection title="Roles" fixedExpanded defaultExpanded underline>
        {roles.length ? (
          <Box sx={{ px: 2, py: 1 }}>
            <ChipList labels={roles.map((role) => role.name)} />
          </Box>
        ) : (
          <EmptyNote>No roles assigned yet.</EmptyNote>
        )}
      </ActionMenuSection>

      <ActionMenuSection
        title="Workgroups"
        fixedExpanded
        defaultExpanded
        underline
      >
        {workgroups.length ? (
          <Box sx={{ px: 2, py: 1 }}>
            <ChipList
              labels={workgroups.map((workgroup) =>
                formatWorkgroupName(workgroup.name),
              )}
            />
          </Box>
        ) : (
          <EmptyNote>Not a member of any workgroup yet.</EmptyNote>
        )}
      </ActionMenuSection>
    </UpdatePanel>
  );
};

export default ViewUser;
