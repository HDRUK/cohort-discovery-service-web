"use client";

import { FeatureFlag } from "@/types/features";
import { ReactNode, useEffect, useRef } from "react";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";
import { isOnlyInDefaultWorkgroup } from "@/utils/user";
import useSessionExpiry from "@/hooks/useSessionExpiry";
import { useSessionData } from "@/contexts/SessionDataContext";

interface ProtectedPageProps {
  featureFlags: FeatureFlag;
  sessionMsRemaining: number | null;
  children: ReactNode;
}

const ProtectedPage = ({
  featureFlags,
  sessionMsRemaining,
  children,
}: ProtectedPageProps) => {
  useSessionExpiry(sessionMsRemaining);
  const { user, userCollections: collections } = useSessionData();

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
      if (ownerId !== user.id) {
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
