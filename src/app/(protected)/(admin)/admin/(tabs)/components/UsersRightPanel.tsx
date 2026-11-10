"use client";
import { useAdminSection } from "@/contexts/AdminSectionContext";
import { useSelectionStore } from "@/store/selectionStore";
import { selectById } from "@/utils/selection";
import { maskClientTest } from "@/lib/maskClientTest";
import ViewUser from "@/modules/ViewUser";

const UsersGuidance = maskClientTest(() => import("./UsersGuidance"));

const UsersRightPanel = () => {
  const selectedUser = selectById(
    useAdminSection()?.users ?? [],
    useSelectionStore((s) => s.selectedUserId),
  );

  if (selectedUser) {
    return <ViewUser user={selectedUser} />;
  }

  return <UsersGuidance />;
};

export default UsersRightPanel;
