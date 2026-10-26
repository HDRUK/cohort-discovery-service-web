"use client";
import useAdminStore from "@/hooks/useAdminStore";
import { maskClientTest } from "@/lib/maskClientTest";
import ViewUser from "@/modules/ViewUser";

const UsersGuidance = maskClientTest(() => import("./UsersGuidance"));

const UsersRightPanel = () => {
  const selectedUser = useAdminStore((s) => s.selectedUser);

  if (selectedUser) {
    return <ViewUser user={selectedUser} />;
  }

  return <UsersGuidance />;
};

export default UsersRightPanel;
