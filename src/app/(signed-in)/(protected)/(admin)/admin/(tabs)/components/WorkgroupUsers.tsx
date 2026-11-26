"use client";

import { useCallback } from "react";
import { Stack, Typography } from "@mui/material";
import UserTable from "@/components/UserTable";
import removeUsersFromWorkgroup from "@/actions/workgroup/removeUsersFromWorkgroup";
import {
  useAdminAccessPolicy,
  useAdminUsers,
} from "@/contexts/AdminSectionContext";
import { useConfirm } from "@/hooks/useConfirm";
import useSelectedManagedUsers from "@/hooks/useSelectedManagedUsers";
import {
  membershipStatus,
  removalSummary,
  workgroupRemovalWarning,
} from "@/lib/membershipEditability";
import { useNotify } from "@/providers/NotifyProvider";
import { MembershipSubject } from "@/types/accessPolicy";
import { User, Workgroup } from "@/types/api";
import { formatWorkgroupName } from "@/utils/workgroups";

const NO_USERS: User[] = [];

interface WorkgroupUsersProps {
  workgroup: Workgroup;
}

const WorkgroupUsers = ({ workgroup }: WorkgroupUsersProps) => {
  const policy = useAdminAccessPolicy();
  const users = useAdminUsers() ?? NO_USERS;
  const confirm = useConfirm();
  const notify = useNotify();

  const { managedUsers } = useSelectedManagedUsers();

  const getMembershipStatus = useCallback(
    (user: User) =>
      policy
        ? membershipStatus(MembershipSubject.Workgroups, policy, user)
        : null,
    [policy],
  );

  const handleDelete = async (ids: string[]) => {
    const warnings = policy
      ? users
          .filter((user) => ids.includes(String(user.id)))
          .map((user) => workgroupRemovalWarning(policy, user, workgroup.id))
          .filter((warning): warning is string => !!warning)
      : [];

    if (warnings.length) {
      const result = await confirm({
        title: "Remove users from workgroup",
        description: (
          <Stack gap={1}>
            <Typography variant="body2">
              The removal takes effect now, but may not last:
            </Typography>
            {warnings.map((warning) => (
              <Typography key={warning} variant="body2">
                {warning}
              </Typography>
            ))}
          </Stack>
        ),
        confirmText: "Remove",
        confirmColor: "warning",
      });
      if (result !== "confirm") return;
    }

    const { failed } = await removeUsersFromWorkgroup({
      ids: ids.map((id) => +id),
      workgroup_id: workgroup.id,
    });

    const summary = removalSummary(ids.length, failed, users, workgroup.name);

    if (failed.length) {
      notify.error(summary);
      return;
    }

    notify.success(summary);
  };

  return (
    <UserTable
      tableTitle={`${formatWorkgroupName(workgroup.name)} Workgroup`}
      tableSubTitle="Users"
      handleDelete={handleDelete}
      deleteDisabled={managedUsers.length > 0}
      getMembershipStatus={getMembershipStatus}
      boxSxProps={{ minHeight: 300 }}
    />
  );
};

export default WorkgroupUsers;
