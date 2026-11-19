import { useMemo } from "react";
import {
  useAdminAccessPolicy,
  useAdminUsers,
} from "@/contexts/AdminSectionContext";
import {
  managedUsersWarning,
  selectedManagedUsers,
} from "@/lib/membershipEditability";
import { useSelectionStore } from "@/store/selectionStore";
import { User } from "@/types/api";

interface SelectedManagedUsers {
  managedUsers: User[];
  warning: string | null;
}

const NO_MANAGED_USERS: SelectedManagedUsers = {
  managedUsers: [],
  warning: null,
};

const useSelectedManagedUsers = (): SelectedManagedUsers => {
  const policy = useAdminAccessPolicy();
  const users = useAdminUsers();
  const selectedUserIds = useSelectionStore((s) => s.selectedUserIds);

  return useMemo(() => {
    if (!policy || !users) return NO_MANAGED_USERS;

    const managedUsers = selectedManagedUsers(policy, users, selectedUserIds);
    return { managedUsers, warning: managedUsersWarning(policy, managedUsers) };
  }, [policy, users, selectedUserIds]);
};

export default useSelectedManagedUsers;
