"use client";

import { Collection, CombinedUser, Custodian, Workgroup } from "@/types/api";
import { FeatureFlag } from "@/types/features";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useUserStore from "@/hooks/useUserStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";

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
  const currentUser = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const isOnlyInDefaultWorkgroup = useUserStore(
    (s) => s.isOnlyInDefaultWorkgroup,
  );
  const setCollections = useUserStore((s) => s.setUserCollections);
  const setCustodians = useUserStore((s) => s.setCustodians);
  const setWorkgroups = useUserStore((s) => s.setWorkgroups);
  const setFlags = useFeatureFlagsStore((s) => s.setFlags);

  const initialiseSelectedDatasets = useQueryBuilder(
    (qb) => qb.initialiseSelectedDatasets,
  );
  const checkSelectedDatasets = useQueryBuilder(
    (qb) => qb.checkSelectedDatasets,
  );

  const renderCount = useRef<number>(null);

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

  useEffect(() => {
    if (renderCount.current == null) {
      initialiseSelectedDatasets(collections, isOnlyInDefaultWorkgroup);
    }
    renderCount.current = 1;
  }, [collections, initialiseSelectedDatasets, isOnlyInDefaultWorkgroup]);

  useEffect(() => {
    if (!currentUser) return;
    checkSelectedDatasets(collections);
  }, [collections, currentUser, checkSelectedDatasets]);

  if (!user) redirect("/403?reason=no-token");

  return <>{children}</>;
};

export default ProtectedPage;
