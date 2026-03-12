"use client";

import {
  Collection,
  CombinedUser,
  Custodian,
  FeatureFlag,
  Workgroup,
} from "@/types/api";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useUserStore from "@/hooks/useUserStore";

interface ProtectedPageProps {
  user: CombinedUser;
  collections: Collection[];
  custodians: Custodian[];
  featureFlags: FeatureFlag;
  workgroups: Workgroup[];
  children: ReactNode;
}

const ProtectedPage = ({
  user,
  collections,
  custodians,
  featureFlags,
  workgroups,
  children,
}: ProtectedPageProps) => {
  const setUser = useUserStore((s) => s.setUser);
  const setCollections = useUserStore((s) => s.setUserCollections);
  const setCustodians = useUserStore((s) => s.setCustodians);
  const setWorkgroups = useUserStore((s) => s.setWorkgroups);
  const setFlags = useFeatureFlagsStore((s) => s.setFlags);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setCollections(collections);
  }, [collections, setCollections]);

  useEffect(() => {
    setCustodians(custodians);
  }, [custodians, setCustodians]);

  useEffect(() => {
    setWorkgroups(workgroups);
  }, [workgroups, setWorkgroups]);

  useEffect(() => {
    setFlags(featureFlags);
  }, [featureFlags, setFlags]);

  if (!user) redirect("/403?reason=no-token");

  return <>{children}</>;
};

export default ProtectedPage;
