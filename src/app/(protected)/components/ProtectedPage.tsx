"use client";

import { Collection, CombinedUser, Custodian, Workgroup } from "@/types/api";
import { FeatureFlag } from "@/types/features";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";
import { shouldResetPreferences } from "@/store/queryBuilderPreferences";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import { isOnlyInDefaultWorkgroup } from "@/utils/user";

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
  const setFlags = useFeatureFlagsStore((s) => s.setFlags);

  const initialiseSelectedDatasets = useQueryBuilder(
    (qb) => qb.initialiseSelectedDatasets,
  );
  const checkSelectedDatasets = useQueryBuilder(
    (qb) => qb.checkSelectedDatasets,
  );
  const resetSelectedDatasetsFor = useQueryBuilder(
    (qb) => qb.resetSelectedDatasetsFor,
  );

  const hasRendered = useRef(false);

  const sessionData = useMemo(
    () => ({ user, userCollections: collections, custodians, workgroups }),
    [user, collections, custodians, workgroups],
  );

  useEffect(() => {
    setFlags(featureFlags);
  }, [featureFlags, setFlags]);

  useEffect(() => {
    if (!hasRendered.current) {
      const { ownerId } = useQueryBuilderStore.getState();
      if (shouldResetPreferences(ownerId, user.id)) {
        resetSelectedDatasetsFor(user.id);
      }
      initialiseSelectedDatasets(collections, isOnlyInDefaultWorkgroup(user));
    }
    hasRendered.current = true;
  }, [collections, initialiseSelectedDatasets, resetSelectedDatasetsFor, user]);

  useEffect(() => {
    checkSelectedDatasets(collections);
  }, [collections, checkSelectedDatasets]);

  return (
    <SessionDataProvider value={sessionData}>{children}</SessionDataProvider>
  );
};

export default ProtectedPage;
