"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CombinedUser, Custodian, FeatureFlag } from "@/types/api";
import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

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
  const {
    userData: { setUser },
    custodianData: { setCustodians },
    featureFlags: { setFlags },
  } = useDaphneStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setCustodians(custodians);
  }, [custodians, setCustodians]);

  useEffect(() => {
    setFlags(featureFlags);
  }, [featureFlags, setFlags]);

  if (!user) {
    forbidden();
  }

  return <>{children} </>;
};

export default ProtectedPage;
