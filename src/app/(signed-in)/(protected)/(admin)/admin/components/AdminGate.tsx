import { ReactNode } from "react";
import { forbidden } from "next/navigation";
import { getCurrentUser } from "@/server/data/user";
import { checkIsAdmin } from "@/utils/user";

const AdminGate = async ({ children }: { children: ReactNode }) => {
  const { data: me } = await getCurrentUser();
  if (!checkIsAdmin(me)) forbidden();

  return children;
};

export default AdminGate;
