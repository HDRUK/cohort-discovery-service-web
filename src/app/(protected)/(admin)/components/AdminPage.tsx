"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Roles } from "@/types/api";
import { forbidden } from "next/navigation";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const {
    userData: { user },
  } = useDaphneStore();

  const { gateway_user } = user || {};
  const is_admin = gateway_user?.cohort_discovery_roles.includes(Roles.ADMIN) ||
    gateway_user?.cohort_discovery_roles.includes(Roles.SYSTEM_ADMIN) || {};

  if (!is_admin) forbidden();

  return children;
};

export default AdminPage;
