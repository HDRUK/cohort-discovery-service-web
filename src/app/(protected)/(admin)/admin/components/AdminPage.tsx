"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { isAdmin } from "@/utils/token";
import { forbidden } from "next/navigation";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const {
    userData: { user },
  } = useDaphneStore();

  const { token_user } = user || {};
  const is_admin = isAdmin(token_user);

  if (user && !is_admin) forbidden();

  return children;
};

export default AdminPage;
