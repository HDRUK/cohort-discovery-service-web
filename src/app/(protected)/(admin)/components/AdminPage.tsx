"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { forbidden } from "next/navigation";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const {
    userData: { user },
  } = useDaphneStore();

  const { gateway_user } = user || {};
  const { is_admin } = gateway_user || {};

  if (!is_admin) forbidden();

  return children;
};

export default AdminPage;
