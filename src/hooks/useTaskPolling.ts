"use client";

import { useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import getTask from "@/actions/task/getTask";
import { TAG_REGRESSION_TASK } from "@/config/tags";
import { DEFAULT_REFRESH_TABLE } from "@/config/defaults";

const useTaskPolling = (
  runStates: Record<string, Set<string>>,
  onComplete: (testPid: string, taskPid: string) => void,
) => {
  const notifiedRef = useRef(new Set<string>());

  useQueries({
    queries: Object.entries(runStates).flatMap(([key, taskPids]) =>
      Array.from(taskPids).map((taskPid) => ({
        queryKey: [TAG_REGRESSION_TASK, taskPid],
        queryFn: () => getTask(taskPid, { cacheOptions: { useCache: false } }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: (query: { state: { data?: Awaited<ReturnType<typeof getTask>> } }) => {
          const task = query.state.data?.data;
          if (!task?.completed_at && !task?.failed_at) return DEFAULT_REFRESH_TABLE;
          if (notifiedRef.current.has(taskPid)) return false;
          notifiedRef.current.add(taskPid);
          onComplete(key, taskPid);
          return false;
        },
      })),
    ),
  });
};

export default useTaskPolling;
