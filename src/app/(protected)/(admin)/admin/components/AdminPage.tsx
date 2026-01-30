"use client";

import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { checkIsAdmin } from "@/utils/user";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((s) => s.user);
  const setCurrentCustodian = useCustodianStore((s) => s.setCurrentCustodian);

  useEffect(() => {
    setCurrentCustodian(null);
  }, [setCurrentCustodian]);

  const isAdmin = checkIsAdmin(user);

  if (user && !isAdmin) forbidden();

  return children;
};

export default AdminPage;
