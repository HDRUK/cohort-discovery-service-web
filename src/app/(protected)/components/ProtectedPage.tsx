"use client";

import { Collection, CombinedUser } from "@/types/api";
import { FeatureFlag } from "@/types/features";
import { ReactNode, useEffect, useRef } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";
import { shouldResetPreferences } from "@/store/queryBuilderPreferences";
import { isOnlyInDefaultWorkgroup } from "@/utils/user";
import useSessionExpiry from "@/hooks/useSessionExpiry";

interface ProtectedPageProps {
  user: CombinedUser;
  collections: Collection[];
  featureFlags: FeatureFlag;
  sessionMsRemaining: number | null;
  children: ReactNode;
}

const ProtectedPage = ({
  user,
  collections,
  featureFlags,
  sessionMsRemaining,
  children,
}: ProtectedPageProps) => {
  useSessionExpiry(sessionMsRemaining);

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

  return <>{children}</>;
};

export default ProtectedPage;
