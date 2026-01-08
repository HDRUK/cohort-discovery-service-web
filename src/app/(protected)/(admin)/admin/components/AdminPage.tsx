"use client";

import useCustodianStore from "@/store/useCustodianStore";
import useUserStore from "@/store/useUserStore";
import { isAdmin } from "@/utils/token";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((s) => s.user);
  const setCurrentCustodian = useCustodianStore((s) => s.setCurrentCustodian);

  useEffect(() => {
    setCurrentCustodian(null);
  }, [setCurrentCustodian]);

  const { token_user } = user || {};
  const is_admin = isAdmin(token_user);

  if (user && !is_admin) forbidden();

  return children;
};

export default AdminPage;
