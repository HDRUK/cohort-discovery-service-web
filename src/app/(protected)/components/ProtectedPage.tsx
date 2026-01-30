"use client";

import { CombinedUser, Custodian, FeatureFlag } from "@/types/api";
import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useUserDataStore } from "@/store/userDataStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";

interface ProtectedPageProps {
  user: CombinedUser;
  custodians: Custodian[];
  featureFlags: FeatureFlag;
  children: ReactNode;
}

const ProtectedPage = ({
  user,
  custodians,
  featureFlags,
  children,
}: ProtectedPageProps) => {
  const setUser = useUserDataStore((s) => s.setUser);
  const setCustodians = useUserDataStore((s) => s.setCustodians);
  const setFlags = useFeatureFlagsStore((s) => s.setFlags);

  useEffect(() => {
    setUser(user);
    setCustodians(custodians);
    setFlags(featureFlags);
  }, [user, custodians, featureFlags, setUser, setCustodians, setFlags]);

  if (!user) forbidden();

  return <>{children}</>;
};

export default ProtectedPage;
