"use client";

/* eslint-disable react-hooks/refs */

import { useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { QUERY_KEYS } from "@/config/tags";
import { DEFAULT_REFRESH_TABLE } from "@/config/defaults";
import { routeGet } from "@/lib/routeFetch";
import { ApiResponse, Task } from "@/types/api";

const useTaskPolling = (
  runStates: Record<string, Set<string>>,
  onComplete: (testPid: string, taskPid: string) => void,
) => {
  const notifiedRef = useRef(new Set<string>());

  useQueries({
    queries: Object.entries(runStates).flatMap(([key, taskPids]) =>
      Array.from(taskPids).map((taskPid) => ({
        queryKey: QUERY_KEYS.task(taskPid),
        queryFn: () => routeGet<ApiResponse<Task>>(routes.api.task(taskPid)),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: (query: { state: { data?: ApiResponse<Task> } }) => {
          const task = query.state.data?.data;
          if (!task?.completed_at && !task?.failed_at)
            return DEFAULT_REFRESH_TABLE;
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
