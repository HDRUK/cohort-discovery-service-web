"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import getQuery from "@/actions/query/getQuery";
import { getTagsQuery } from "@/config/tags";
import { TaskHistoryTask } from "@/types/api";
import { queryToText } from "@/utils/queryBuilder";
import { distinctQueryPids, MAX_QUERY_DEFINITIONS } from "./taskTable";

const useQueryDefinitions = (
  tasks: TaskHistoryTask[],
  enabled: boolean,
): {
  textByPid: Record<string, string | undefined>;
  isLoading: boolean;
  cappedAt: number | null;
} => {
  const pids = useMemo(() => distinctQueryPids(tasks), [tasks]);
  const fetched = useMemo(() => pids.slice(0, MAX_QUERY_DEFINITIONS), [pids]);

  const results = useQueries({
    queries: fetched.map((pid) => ({
      queryKey: getTagsQuery(pid),
      queryFn: () => getQuery(pid),
      enabled,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    })),
  });

  const textByPid = useMemo(() => {
    const entries = fetched.map((pid, index) => {
      const definition = results[index]?.data?.data?.definition;
      return [pid, definition ? queryToText(definition) : undefined] as const;
    });

    return Object.fromEntries(entries);
  }, [fetched, results]);

  return {
    textByPid,
    isLoading: results.some((result) => result.isLoading),
    cappedAt:
      pids.length > MAX_QUERY_DEFINITIONS ? MAX_QUERY_DEFINITIONS : null,
  };
};

export default useQueryDefinitions;
