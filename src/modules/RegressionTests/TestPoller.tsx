"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import getTask from "@/actions/task/getTask";

interface TestPollerProps {
  taskPid: string;
  onComplete: (taskPid: string) => void;
}

const TestPoller = ({ taskPid, onComplete }: TestPollerProps) => {
  const hasCompletedRef = useRef(false);

  useQuery({
    queryKey: ["regression-task", taskPid],
    queryFn: () => getTask(taskPid, { cacheOptions: { useCache: false } }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: (query) => {
      const task = query.state.data?.data;
      if (!task?.completed_at && !task?.failed_at) return 1000;
      if (hasCompletedRef.current) return false;
      hasCompletedRef.current = true;
      onComplete(taskPid);
      return false;
    },
  });

  return null;
};

export default TestPoller;
