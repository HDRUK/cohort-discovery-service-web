"use client";

import { useQueries } from "@tanstack/react-query";
import getCollectionHealth from "@/actions/collection/getCollectionHealth";
import { getTagsCollectionHealth } from "@/config/tags";
import { CollectionHealthSeries } from "@/types/api";
import { STALE_TIME_TELEMETRY } from "./telemetryChart";
import { TimeRange } from "./timeRange";

export interface AggregateHealth {
  healthByPid: Record<string, CollectionHealthSeries | null>;
  isLoading: boolean;
  failedPids: string[];
}

const useAggregateHealth = (
  pids: string[],
  bin: string,
  range: TimeRange,
  enabled: boolean,
): AggregateHealth =>
  useQueries({
    queries: pids.map((pid) => ({
      queryKey: getTagsCollectionHealth(pid, bin, range),
      queryFn: () => getCollectionHealth(pid, bin, range),
      enabled,
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME_TELEMETRY,
    })),
    combine: (results) => ({
      healthByPid: Object.fromEntries(
        pids.map((pid, index) => [pid, results[index]?.data?.data ?? null]),
      ),
      isLoading: results.some((result) => result.isLoading),
      failedPids: pids.filter(
        (_, index) => results[index]?.isError || !!results[index]?.data?.error,
      ),
    }),
  });

export default useAggregateHealth;
