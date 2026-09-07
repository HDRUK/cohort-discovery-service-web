"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import createRegressionTest from "@/actions/regressionTest/createRegressionTest";
import getRegressionTests from "@/actions/regressionTest/getRegressionTests";
import runRegressionTest from "@/actions/regressionTest/runRegressionTest";
import updateRegressionTest from "@/actions/regressionTest/updateRegressionTest";
import {
  TAG_COLLECTION_HEALTH,
  TAG_COLLECTIONS_ADMIN,
  TAG_REGRESSION_TESTS,
} from "@/config/tags";
import useTaskPolling from "@/hooks/useTaskPolling";
import { useDefaults } from "@/providers/DefaultProvider";
import { useNotify } from "@/providers/NotifyProvider";
import { CollectionWithHosts, Paginated, RegressionTest } from "@/types/api";
import { buildHealthRows, HealthThresholds } from "./health";

export const COLLECTIONS_PER_PAGE = "500";
export const REFRESH_INTERVAL = 10_000;

const REFRESH_OPTIONS = {
  refetchInterval: REFRESH_INTERVAL,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

const QUERY_KEY_COLLECTIONS = [TAG_COLLECTION_HEALTH, TAG_COLLECTIONS_ADMIN];
const QUERY_KEY_REGRESSION = [TAG_COLLECTION_HEALTH, TAG_REGRESSION_TESTS];

const useCollectionHealth = ({
  initialCollections,
  fetchedAt,
}: {
  initialCollections: CollectionWithHosts[];
  fetchedAt: number;
}) => {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const defaults = useDefaults();

  const [runStates, setRunStates] = useState<Record<string, Set<string>>>({});

  const {
    data: collectionsResponse,
    isFetching: isFetchingCollections,
    isError: isCollectionsError,
    dataUpdatedAt: collectionsUpdatedAt,
  } = useQuery({
    queryKey: QUERY_KEY_COLLECTIONS,
    queryFn: () =>
      getAdminCollections({
        params: new URLSearchParams({ per_page: COLLECTIONS_PER_PAGE }),
        cacheOptions: { useCache: false },
      }),
    initialData: {
      message: "",
      data: { data: initialCollections } as Paginated<CollectionWithHosts>,
    },
    initialDataUpdatedAt: fetchedAt,
    ...REFRESH_OPTIONS,
  });

  const {
    data: regressionResponse,
    isFetching: isFetchingRegression,
    isError: isRegressionError,
    dataUpdatedAt: regressionUpdatedAt,
  } = useQuery({
    queryKey: QUERY_KEY_REGRESSION,
    queryFn: () => getRegressionTests(),
    ...REFRESH_OPTIONS,
  });

  const now = useMemo(
    () =>
      Math.max(collectionsUpdatedAt || 0, regressionUpdatedAt || 0) ||
      fetchedAt,
    [collectionsUpdatedAt, regressionUpdatedAt, fetchedAt],
  );

  const collections = useMemo(
    () => collectionsResponse?.data?.data ?? [],
    [collectionsResponse],
  );

  const tests = useMemo<RegressionTest[]>(
    () => regressionResponse?.data ?? [],
    [regressionResponse],
  );

  const thresholds = useMemo<HealthThresholds>(
    () => ({
      pingA: {
        warnAfterMs: defaults.pingAWarnMs,
        failAfterMs: defaults.pingAFailMs,
      },
      pingB: {
        warnAfterMs: defaults.pingBWarnMs,
        failAfterMs: defaults.pingBFailMs,
      },
    }),
    [
      defaults.pingAWarnMs,
      defaults.pingAFailMs,
      defaults.pingBWarnMs,
      defaults.pingBFailMs,
    ],
  );

  const rows = useMemo(
    () => buildHealthRows(collections, tests, now, thresholds),
    [collections, tests, now, thresholds],
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY_COLLECTIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEY_REGRESSION });
  }, [queryClient]);

  const handleTaskComplete = useCallback(
    (collectionPid: string, taskPid: string) => {
      setRunStates((previous) => {
        const remaining = new Set(previous[collectionPid] ?? []);
        remaining.delete(taskPid);

        if (remaining.size === 0) {
          const { [collectionPid]: _removed, ...rest } = previous;
          return rest;
        }

        return { ...previous, [collectionPid]: remaining };
      });
      invalidate();
    },
    [invalidate],
  );

  useTaskPolling(runStates, handleTaskComplete);

  const addHealthCheck = useCallback(
    async (values: Parameters<typeof createRegressionTest>[0]) => {
      const result = await createRegressionTest(values);
      if (result.error) {
        notify.error(`Could not add the health check: ${result.error}`);
        return;
      }

      notify.success("Health check added");
      invalidate();
    },
    [invalidate, notify],
  );

  const updateExpected = useCallback(
    async (testPid: string, expected: number | null, collectionPid: string) => {
      const test = tests.find((candidate) => candidate.pid === testPid);
      if (!test) return;

      const result = await updateRegressionTest(testPid, {
        collections: test.collections.map((collection) => ({
          pid: collection.pid,
          expected_result:
            collection.pid === collectionPid
              ? expected
              : collection.expected_result,
        })),
      });

      if (result.error) {
        notify.error(`Could not save the expected count: ${result.error}`);
        return;
      }

      invalidate();
    },
    [invalidate, notify, tests],
  );

  const trackRun = useCallback(
    (collectionPid: string, taskPids: Set<string>) => {
      if (taskPids.size === 0) {
        invalidate();
        return;
      }

      setRunStates((previous) => ({ ...previous, [collectionPid]: taskPids }));
    },
    [invalidate],
  );

  const runTest = useCallback(
    async (testPid: string, collectionPid: string) => {
      const result = await runRegressionTest(testPid, collectionPid);
      if (result.error) {
        notify.error(`Could not run the health check: ${result.error}`);
        return;
      }

      trackRun(collectionPid, new Set(result.data?.task_pids ?? []));
    },
    [notify, trackRun],
  );

  return {
    rows,
    tests,
    collections,
    now,
    runStates,
    isFetching: isFetchingCollections || isFetchingRegression,
    isFetchingRegression,
    hasRegressionResponse: !!regressionResponse,
    isError: isCollectionsError || isRegressionError,
    invalidate,
    addHealthCheck,
    updateExpected,
    runTest,
  };
};

export default useCollectionHealth;
