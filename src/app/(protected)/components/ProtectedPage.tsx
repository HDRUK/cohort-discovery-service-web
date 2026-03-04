"use client";

import { CombinedUser, Custodian, FeatureFlag, Workgroup } from "@/types/api";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useUserStore from "@/hooks/useUserStore";

interface ProtectedPageProps {
  user: CombinedUser;
  custodians: Custodian[];
  featureFlags: FeatureFlag;
  workgroups: Workgroup[];
  children: ReactNode;
}

const ProtectedPage = ({
  user,
  custodians,
  featureFlags,
  workgroups,
  children,
}: ProtectedPageProps) => {
  const setUser = useUserStore((s) => s.setUser);
  const setCustodians = useUserStore((s) => s.setCustodians);
  const setWorkgroups = useUserStore((s) => s.setWorkgroups);
  const setFlags = useFeatureFlagsStore((s) => s.setFlags);

  useEffect(() => {
    setUser(user);
    setCustodians(custodians);
    setFlags(featureFlags);
  }, [user, custodians, featureFlags, setUser, setCustodians, setFlags]);

  useEffect(() => {
    setWorkgroups(workgroups);
  }, [workgroups, setWorkgroups]);

  if (!user) redirect("/403?reason=no-token");

  return <>{children}</>;
};

export default ProtectedPage;
